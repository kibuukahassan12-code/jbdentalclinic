import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import cron from 'node-cron';
import { runExtensionMigrations } from './migrate-extensions.js';
import { normalizeE164 } from './lib/whatsapp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db;

function resolveDbPath() {
  // Prefer env-provided path (e.g., /app/data/appointments.db)
  const envPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'appointments.db');
  // Ensure parent directory exists
  try {
    fs.mkdirSync(path.dirname(envPath), { recursive: true });
    // Test writeability by opening/closing a dummy file
    const testPath = path.join(path.dirname(envPath), '.write-test');
    fs.writeFileSync(testPath, '');
    fs.unlinkSync(testPath);
    return envPath;
  } catch (e) {
    // Fallback to local ./data/appointments.db if volume not writable
    const fallbackPath = path.join(__dirname, '..', 'data', 'appointments.db');
    fs.mkdirSync(path.dirname(fallbackPath), { recursive: true });
    return fallbackPath;
  }
}

export function getDb() {
  if (!db) {
    const dbPath = resolveDbPath();
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    migrate(db);
  }
  return db;
}

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      patient_id INTEGER,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 30,
      service TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Scheduled',
      reminder_sent_at TEXT,
      thank_you_sent_at TEXT,
      reminder_1day_sent_at TEXT,
      reminder_6h_sent_at TEXT,
      reminder_1h_sent_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_reminder ON appointments(appointment_date, reminder_sent_at);
  `);
  runExtensionMigrations(database);
}

export function initDb() {
  const database = getDb();
  // Core tables
  database.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      date_of_birth TEXT,
      gender TEXT,
      medical_history TEXT,
      allergies TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
    CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(full_name);
  `);
  database.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      patient_id INTEGER,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 30,
      service TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Scheduled',
      reminder_sent_at TEXT,
      thank_you_sent_at TEXT,
      reminder_1day_sent_at TEXT,
      reminder_6h_sent_at TEXT,
      reminder_1h_sent_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_reminder ON appointments(appointment_date, reminder_sent_at);
  `);
  database.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      paid_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
  `);
  database.exec(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      dentist_id INTEGER,
      treatment_plan_id INTEGER,
      service_name TEXT NOT NULL,
      description TEXT,
      cost REAL,
      treatment_date TEXT,
      status TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_treatments_patient ON treatments(patient_id);
    CREATE INDEX IF NOT EXISTS idx_treatments_plan ON treatments(treatment_plan_id);
    CREATE INDEX IF NOT EXISTS idx_treatments_date ON treatments(treatment_date);
  `);
  // Run extension migrations for remaining tables (staff, invoices, inventory, etc.)
  runExtensionMigrations(database);
  // Schedule daily backup
  scheduleBackup();
  return database;
}

// ---------- Automatic Backup ----------
function scheduleBackup() {
  // Run once daily at 2 AM server time (adjustable via env)
  const schedule = process.env.BACKUP_CRON || '0 2 * * *';
  cron.schedule(schedule, () => {
    try {
      const src = resolveDbPath();
      const backupsDir = path.join(path.dirname(src), '..', 'backups');
      fs.mkdirSync(backupsDir, { recursive: true });
      const timestamp = new Date().toISOString().slice(0, 10);
      const dest = path.join(backupsDir, `appointments-${timestamp}.db`);
      fs.copyFileSync(src, dest);
      console.log(`[backup] Database backed up to ${dest}`);
    } catch (e) {
      console.error('[backup] Backup failed:', e);
    }
  }, { scheduled: true, timezone: process.env.TZ || 'Africa/Kampala' });
}

export function getAppointments(filters = {}) {
  const database = getDb();
  const { date, fromDate, toDate, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM appointments WHERE 1=1';
  const params = [];

  if (date) {
    sql += ' AND appointment_date = ?';
    params.push(date);
  }
  if (fromDate) {
    sql += ' AND appointment_date >= ?';
    params.push(fromDate);
  }
  if (toDate) {
    sql += ' AND appointment_date <= ?';
    params.push(toDate);
  }
  sql += ' ORDER BY appointment_date ASC, appointment_time ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = database.prepare(sql);
  return stmt.all(...params);
}

export function getAppointmentsForReminder(targetDate = null) {
  const database = getDb();
  const date = targetDate || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const stmt = database.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ? AND reminder_sent_at IS NULL
    ORDER BY appointment_time ASC
  `);
  return stmt.all(date);
}

export function getAppointmentById(id) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM appointments WHERE id = ?');
  return stmt.get(id);
}

export function createAppointment(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO appointments (patient_name, patient_phone, appointment_date, appointment_time, service, notes, patient_id, dentist_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.patient_name,
    data.patient_phone,
    data.appointment_date,
    data.appointment_time,
    data.service || null,
    data.notes || null,
    data.patient_id ?? null,
    data.dentist_id ?? null,
    data.status && ['Scheduled', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'].includes(data.status) ? data.status : 'Scheduled'
  );
  return result.lastInsertRowid;
}

export function updateAppointment(id, data) {
  const database = getDb();
  const statusVal = data.status && ['Scheduled', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'].includes(data.status) ? data.status : undefined;
  const stmt = database.prepare(`
    UPDATE appointments SET
      patient_name = ?, patient_phone = ?, appointment_date = ?, appointment_time = ?,
      service = ?, notes = ?,
      patient_id = COALESCE(?, patient_id),
      dentist_id = COALESCE(?, dentist_id),
      status = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ?
  `);
  const result = stmt.run(
    data.patient_name,
    data.patient_phone,
    data.appointment_date,
    data.appointment_time,
    data.service ?? null,
    data.notes ?? null,
    data.patient_id ?? null,
    data.dentist_id ?? null,
    statusVal ?? null,
    id
  );
  return result.changes;
}

export function markReminderSent(id) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE appointments SET reminder_sent_at = datetime('now'), updated_at = datetime('now') WHERE id = ?
  `);
  return stmt.run(id);
}

export function deleteAppointment(id) {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM appointments WHERE id = ?');
  return stmt.run(id);
}

// ---------- Patients (Phase 1) ----------
export function getPatients(filters = {}) {
  const database = getDb();
  const { limit = 100, offset = 0 } = filters;
  const stmt = database.prepare(
    'SELECT * FROM patients ORDER BY full_name ASC LIMIT ? OFFSET ?'
  );
  return stmt.all(Math.min(Number(limit) || 100, 500), Number(offset) || 0);
}

export function getPatientById(id) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM patients WHERE id = ?');
  return stmt.get(id);
}

export function getPatientByPhone(phone) {
  const database = getDb();
  const normalized = normalizeE164(phone);
  // Search by raw input, normalized 256XX form, and local 0XX form
  const candidates = [phone];
  if (normalized) {
    candidates.push(normalized);
    candidates.push('0' + normalized.slice(3));
  }
  const placeholders = candidates.map(() => '?').join(' OR phone = ');
  const stmt = database.prepare(`
    SELECT * FROM patients 
    WHERE phone = ${placeholders}
    LIMIT 1
  `);
  return stmt.get(...candidates);
}

export function searchPatients(q) {
  const database = getDb();
  const term = `%${String(q || '').trim()}%`;
  const stmt = database.prepare(
    `SELECT * FROM patients WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ?
     ORDER BY full_name ASC LIMIT 100`
  );
  return stmt.all(term, term, term);
}

export function createPatient(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO patients (full_name, phone, email, date_of_birth, gender, medical_history, allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.full_name,
    data.phone,
    data.email || null,
    data.date_of_birth || null,
    data.gender || null,
    data.medical_history || null,
    data.allergies || null
  );
  return result.lastInsertRowid;
}

export function updatePatient(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE patients SET
      full_name = ?, phone = ?, email = ?, date_of_birth = ?, gender = ?,
      medical_history = ?, allergies = ?
    WHERE id = ?
  `);
  return stmt.run(
    data.full_name,
    data.phone,
    data.email ?? null,
    data.date_of_birth ?? null,
    data.gender ?? null,
    data.medical_history ?? null,
    data.allergies ?? null,
    id
  );
}

export function deletePatient(id) {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM patients WHERE id = ?');
  return stmt.run(id);
}

// ---------- Patient reports ----------
export function getPatientReports(filters = {}) {
  const database = getDb();
  const { patient_id, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM patient_reports WHERE 1=1';
  const params = [];
  if (patient_id != null) {
    sql += ' AND patient_id = ?';
    params.push(patient_id);
  }
  sql += ' ORDER BY report_date DESC, id DESC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getPatientReportById(id) {
  return getDb().prepare('SELECT * FROM patient_reports WHERE id = ?').get(id);
}

export function createPatientReport(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO patient_reports (patient_id, doctor_id, report_date, chief_complaint, clinical_findings, diagnosis, treatment_plan, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.patient_id,
    data.doctor_id ?? null,
    data.report_date || null,
    data.chief_complaint || null,
    data.clinical_findings || null,
    data.diagnosis || null,
    data.treatment_plan || null,
    data.notes || null
  );
  return result.lastInsertRowid;
}

export function updatePatientReport(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE patient_reports SET
      patient_id = ?, doctor_id = ?, report_date = ?, chief_complaint = ?, clinical_findings = ?, diagnosis = ?, treatment_plan = ?, notes = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.patient_id,
    data.doctor_id ?? null,
    data.report_date || null,
    data.chief_complaint ?? null,
    data.clinical_findings ?? null,
    data.diagnosis ?? null,
    data.treatment_plan ?? null,
    data.notes ?? null,
    id
  );
}

export function deletePatientReport(id) {
  return getDb().prepare('DELETE FROM patient_reports WHERE id = ?').run(id);
}

// ---------- Staff (Phase 1) ----------
export function getStaff(filters = {}) {
  const database = getDb();
  const { role, is_active, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM staff WHERE 1=1';
  const params = [];
  if (role) {
    sql += ' AND role = ?';
    params.push(role);
  }
  if (typeof is_active === 'boolean' || typeof is_active === 'number') {
    sql += ' AND is_active = ?';
    params.push(is_active ? 1 : 0);
  }
  sql += ' ORDER BY full_name ASC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  const stmt = database.prepare(sql);
  return stmt.all(...params);
}

export function getStaffMemberById(id) {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM staff WHERE id = ?');
  return stmt.get(id);
}

export function getStaffByRole(role) {
  return getStaff({ role, limit: 500 });
}

export function createStaff(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO staff (full_name, role, phone, email, salary, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.full_name,
    data.role,
    data.phone || null,
    data.email || null,
    data.salary ?? null,
    data.is_active !== false ? 1 : 0
  );
  return result.lastInsertRowid;
}

export function updateStaff(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE staff SET
      full_name = ?, role = ?, phone = ?, email = ?, salary = ?, is_active = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.full_name,
    data.role,
    data.phone ?? null,
    data.email ?? null,
    data.salary ?? null,
    data.is_active !== false ? 1 : 0,
    id
  );
}

export function deleteStaff(id) {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM staff WHERE id = ?');
  return stmt.run(id);
}

// ---------- Treatment plans (Phase 2) ----------
export function getTreatmentPlans(filters = {}) {
  const database = getDb();
  const { patient_id, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM treatment_plans WHERE 1=1';
  const params = [];
  if (patient_id != null) {
    sql += ' AND patient_id = ?';
    params.push(patient_id);
  }
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getTreatmentPlanById(id) {
  return getDb().prepare('SELECT * FROM treatment_plans WHERE id = ?').get(id);
}

export function createTreatmentPlan(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO treatment_plans (patient_id, total_estimated_cost, status)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(
    data.patient_id,
    data.total_estimated_cost ?? null,
    data.status || 'Active'
  );
  return result.lastInsertRowid;
}

export function updateTreatmentPlan(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE treatment_plans SET
      patient_id = ?, total_estimated_cost = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.patient_id,
    data.total_estimated_cost ?? null,
    data.status ?? 'Active',
    id
  );
}

export function deleteTreatmentPlan(id) {
  return getDb().prepare('DELETE FROM treatment_plans WHERE id = ?').run(id);
}

// ---------- Treatments (Phase 2) ----------
export function getTreatments(filters = {}) {
  const database = getDb();
  const { patient_id, dentist_id, treatment_plan_id, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM treatments WHERE 1=1';
  const params = [];
  if (patient_id != null) { sql += ' AND patient_id = ?'; params.push(patient_id); }
  if (dentist_id != null) { sql += ' AND dentist_id = ?'; params.push(dentist_id); }
  if (treatment_plan_id != null) { sql += ' AND treatment_plan_id = ?'; params.push(treatment_plan_id); }
  sql += ' ORDER BY treatment_date DESC, id DESC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getTreatmentById(id) {
  return getDb().prepare('SELECT * FROM treatments WHERE id = ?').get(id);
}

export function createTreatment(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO treatments (patient_id, dentist_id, treatment_plan_id, service_name, description, cost, treatment_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.patient_id,
    data.dentist_id ?? null,
    data.treatment_plan_id ?? null,
    data.service_name,
    data.description ?? null,
    data.cost ?? null,
    data.treatment_date ?? null,
    data.status || 'Pending'
  );
  return result.lastInsertRowid;
}

export function updateTreatment(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE treatments SET
      patient_id = ?, dentist_id = ?, treatment_plan_id = ?, service_name = ?, description = ?,
      cost = ?, treatment_date = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.patient_id,
    data.dentist_id ?? null,
    data.treatment_plan_id ?? null,
    data.service_name,
    data.description ?? null,
    data.cost ?? null,
    data.treatment_date ?? null,
    data.status ?? 'Pending',
    id
  );
}

export function deleteTreatment(id) {
  return getDb().prepare('DELETE FROM treatments WHERE id = ?').run(id);
}

// ---------- Dental chart (Phase 2) ----------
export function getDentalChartEntries(filters = {}) {
  const database = getDb();
  const { patient_id, limit = 200, offset = 0 } = filters;
  let sql = 'SELECT * FROM dental_chart WHERE 1=1';
  const params = [];
  if (patient_id != null) { sql += ' AND patient_id = ?'; params.push(patient_id); }
  sql += ' ORDER BY tooth_number ASC, id ASC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 200, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getDentalChartEntryById(id) {
  return getDb().prepare('SELECT * FROM dental_chart WHERE id = ?').get(id);
}

export function createDentalChartEntry(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO dental_chart (patient_id, tooth_number, condition, notes)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.patient_id,
    data.tooth_number,
    data.condition ?? null,
    data.notes ?? null
  );
  return result.lastInsertRowid;
}

export function updateDentalChartEntry(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE dental_chart SET
      patient_id = ?, tooth_number = ?, condition = ?, notes = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.patient_id,
    data.tooth_number,
    data.condition ?? null,
    data.notes ?? null,
    id
  );
}

export function deleteDentalChartEntry(id) {
  return getDb().prepare('DELETE FROM dental_chart WHERE id = ?').run(id);
}

// ---------- Invoices (Phase 3) ----------
export function getInvoices(filters = {}) {
  const database = getDb();
  const { patient_id, status, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM invoices WHERE 1=1';
  const params = [];
  if (patient_id != null) { sql += ' AND patient_id = ?'; params.push(patient_id); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getInvoiceById(id) {
  return getDb().prepare('SELECT * FROM invoices WHERE id = ?').get(id);
}

export function createInvoice(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO invoices (patient_id, total_amount, discount, tax, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.patient_id,
    data.total_amount ?? 0,
    data.discount ?? 0,
    data.tax ?? 0,
    data.status || 'Pending'
  );
  return result.lastInsertRowid;
}

export function updateInvoice(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE invoices SET
      patient_id = ?, total_amount = ?, discount = ?, tax = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.patient_id,
    data.total_amount ?? 0,
    data.discount ?? 0,
    data.tax ?? 0,
    data.status ?? 'Pending',
    id
  );
}

export function deleteInvoice(id) {
  return getDb().prepare('DELETE FROM invoices WHERE id = ?').run(id);
}

// ---------- Payments (Phase 3) ----------
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank'];

export function getPayments(filters = {}) {
  const database = getDb();
  const { invoice_id, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM payments WHERE 1=1';
  const params = [];
  if (invoice_id != null) { sql += ' AND invoice_id = ?'; params.push(invoice_id); }
  sql += ' ORDER BY paid_at DESC, id DESC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getPaymentById(id) {
  return getDb().prepare('SELECT * FROM payments WHERE id = ?').get(id);
}

export function createPayment(data) {
  const database = getDb();
  const method = PAYMENT_METHODS.includes(data.payment_method) ? data.payment_method : 'Cash';
  const stmt = database.prepare(`
    INSERT INTO payments (invoice_id, amount, payment_method, paid_at)
    VALUES (?, ?, ?, COALESCE(?, datetime('now')))
  `);
  const result = stmt.run(data.invoice_id, data.amount, method, data.paid_at ?? null);
  return result.lastInsertRowid;
}

export function updatePayment(id, data) {
  const database = getDb();
  const method = data.payment_method && PAYMENT_METHODS.includes(data.payment_method) ? data.payment_method : undefined;
  const stmt = database.prepare(`
    UPDATE payments SET
      invoice_id = ?, amount = ?,
      payment_method = COALESCE(?, payment_method),
      paid_at = COALESCE(?, paid_at)
    WHERE id = ?
  `);
  return stmt.run(
    data.invoice_id,
    data.amount,
    method ?? null,
    data.paid_at ?? null,
    id
  );
}

export function deletePayment(id) {
  return getDb().prepare('DELETE FROM payments WHERE id = ?').run(id);
}

export function getTotalPaidForInvoice(invoiceId) {
  const row = getDb().prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE invoice_id = ?').get(invoiceId);
  return row ? Number(row.total) : 0;
}

// ---------- Inventory (Phase 4) ----------
export function getInventoryItems(filters = {}) {
  const database = getDb();
  const { limit = 100, offset = 0, low_stock_only } = filters;
  let sql = 'SELECT * FROM inventory_items WHERE 1=1';
  const params = [];
  if (low_stock_only) {
    sql += ' AND quantity <= minimum_stock AND minimum_stock > 0';
  }
  sql += ' ORDER BY name ASC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function getInventoryItemById(id) {
  return getDb().prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);
}

export function createInventoryItem(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO inventory_items (name, quantity, minimum_stock, supplier)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.name,
    data.quantity ?? 0,
    data.minimum_stock ?? 0,
    data.supplier ?? null
  );
  return result.lastInsertRowid;
}

export function updateInventoryItem(id, data) {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE inventory_items SET
      name = ?, quantity = ?, minimum_stock = ?, supplier = ?,
      last_updated = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(
    data.name,
    data.quantity ?? 0,
    data.minimum_stock ?? 0,
    data.supplier ?? null,
    id
  );
}

export function deleteInventoryItem(id) {
  return getDb().prepare('DELETE FROM inventory_items WHERE id = ?').run(id);
}

/** Returns items where quantity <= minimum_stock and minimum_stock > 0 */
export function getLowStockItems() {
  return getInventoryItems({ limit: 500, low_stock_only: true });
}

// ---------- Reports (Phase 5) ----------
/** Daily revenue: sum of payments where paid_at date = given date (YYYY-MM-DD) */
export function getDailyRevenue(date) {
  const row = getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM payments
    WHERE date(paid_at) = ?
  `).get(date);
  return row ? Number(row.total) : 0;
}

/** Monthly revenue: sum of payments in the given month (YYYY-MM) */
export function getMonthlyRevenue(yearMonth) {
  const row = getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM payments
    WHERE strftime('%Y-%m', paid_at) = ?
  `).get(yearMonth);
  return row ? Number(row.total) : 0;
}

/** Outstanding balance: sum of (invoice total - discount + tax) minus sum of payments per invoice, for unpaid/pending */
export function getOutstandingBalances() {
  const database = getDb();
  const invoices = database.prepare(`
    SELECT id, patient_id, total_amount, discount, tax, status
    FROM invoices
    WHERE status IN ('Pending', 'Partially Paid')
    ORDER BY created_at DESC
  `).all();
  const out = [];
  for (const inv of invoices) {
    const total = Number(inv.total_amount) - Number(inv.discount || 0) + Number(inv.tax || 0);
    const paid = getTotalPaidForInvoice(inv.id);
    const balance = total - paid;
    if (balance > 0) {
      out.push({ invoice_id: inv.id, patient_id: inv.patient_id, total, paid, balance });
    }
  }
  return out;
}

/** Total outstanding across all invoices */
export function getTotalOutstanding() {
  const balances = getOutstandingBalances();
  return balances.reduce((sum, b) => sum + b.balance, 0);
}

// ---------- Expenses (Phase 5) ----------
export function getExpenses(filters = {}) {
  const database = getDb();
  const { fromDate, toDate, limit = 100, offset = 0 } = filters;
  let sql = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];
  if (fromDate) { sql += ' AND date >= ?'; params.push(fromDate); }
  if (toDate) { sql += ' AND date <= ?'; params.push(toDate); }
  sql += ' ORDER BY date DESC, id DESC LIMIT ? OFFSET ?';
  params.push(Math.min(Number(filters.limit) || 100, 500), Number(offset) || 0);
  return database.prepare(sql).all(...params);
}

export function createExpense(data) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO expenses (description, amount, category, date)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(data.description, data.amount, data.category || 'General', data.date).lastInsertRowid;
}

export function deleteExpense(id) {
  return getDb().prepare('DELETE FROM expenses WHERE id = ?').run(id);
}

/** Daily expenses: sum of expenses where date = given date (YYYY-MM-DD) */
export function getDailyExpenses(date) {
  const row = getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE date = ?
  `).get(date);
  return row ? Number(row.total) : 0;
}

/** Monthly expenses: sum of expenses in the given month (YYYY-MM) */
export function getMonthlyExpenses(yearMonth) {
  const row = getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE strftime('%Y-%m', date) = ?
  `).get(yearMonth);
  return row ? Number(row.total) : 0;
}

/** Revenue range: sum of payments between start and end dates (inclusive) */
export function getRevenueRange(startDate, endDate) {
  const row = getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM payments
    WHERE date(paid_at) BETWEEN ? AND ?
  `).get(startDate, endDate);
  return row ? Number(row.total) : 0;
}

/** Expense range: sum of expenses between start and end dates (inclusive) */
export function getExpenseRange(startDate, endDate) {
  const row = getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE date BETWEEN ? AND ?
  `).get(startDate, endDate);
  return row ? Number(row.total) : 0;
}
