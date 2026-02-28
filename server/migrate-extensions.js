/**
 * Extension migrations: new tables and columns only.
 * Does not modify or remove existing appointments table or its existing columns.
 */
function runExtensionMigrations(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);
  const hasMigration = (name) => database.prepare('SELECT 1 FROM schema_migrations WHERE name = ?').get(name);
  const addMigration = (name) => database.prepare('INSERT OR IGNORE INTO schema_migrations (name) VALUES (?)').run(name);

  if (!hasMigration('patients')) {
    database.exec(`
      CREATE TABLE patients (
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
    addMigration('patients');
  }

  if (!hasMigration('staff')) {
    database.exec(`
      CREATE TABLE staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        salary REAL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
      CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);
    `);
    addMigration('staff');
  }

  if (!hasMigration('appointments_extra_columns')) {
    const info = database.prepare('PRAGMA table_info(appointments)').all();
    const hasCol = (name) => info.some((c) => c.name === name);
    if (!hasCol('patient_id')) database.exec('ALTER TABLE appointments ADD COLUMN patient_id INTEGER REFERENCES patients(id)');
    if (!hasCol('dentist_id')) database.exec('ALTER TABLE appointments ADD COLUMN dentist_id INTEGER REFERENCES staff(id)');
    if (!hasCol('status')) database.exec("ALTER TABLE appointments ADD COLUMN status TEXT DEFAULT 'Pending'");
    addMigration('appointments_extra_columns');
  }

  // Phase 2: Treatment plans (before treatments, FK from treatments)
  if (!hasMigration('treatment_plans')) {
    database.exec(`
      CREATE TABLE treatment_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL REFERENCES patients(id),
        total_estimated_cost REAL,
        status TEXT DEFAULT 'Active',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient ON treatment_plans(patient_id);
    `);
    addMigration('treatment_plans');
  }

  if (!hasMigration('treatments')) {
    database.exec(`
      CREATE TABLE treatments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL REFERENCES patients(id),
        dentist_id INTEGER REFERENCES staff(id),
        treatment_plan_id INTEGER REFERENCES treatment_plans(id),
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
    addMigration('treatments');
  }

  if (!hasMigration('dental_chart')) {
    database.exec(`
      CREATE TABLE dental_chart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL REFERENCES patients(id),
        tooth_number TEXT NOT NULL,
        condition TEXT,
        notes TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_dental_chart_patient ON dental_chart(patient_id);
    `);
    addMigration('dental_chart');
  }

  // Phase 3: Billing
  if (!hasMigration('invoices')) {
    database.exec(`
      CREATE TABLE invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL REFERENCES patients(id),
        total_amount REAL NOT NULL,
        discount REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        status TEXT DEFAULT 'Pending',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at);
    `);
    addMigration('invoices');
  }

  if (!hasMigration('payments')) {
    database.exec(`
      CREATE TABLE payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL REFERENCES invoices(id),
        amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        paid_at TEXT DEFAULT (datetime('now')),
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
    `);
    addMigration('payments');
  }

  // Patient reports (doctor notes, clinical findings, etc.)
  if (!hasMigration('patient_reports')) {
    database.exec(`
      CREATE TABLE patient_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL REFERENCES patients(id),
        doctor_id INTEGER REFERENCES staff(id),
        report_date TEXT NOT NULL,
        chief_complaint TEXT,
        clinical_findings TEXT,
        diagnosis TEXT,
        treatment_plan TEXT,
        notes TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_patient_reports_patient ON patient_reports(patient_id);
      CREATE INDEX IF NOT EXISTS idx_patient_reports_date ON patient_reports(report_date);
    `);
    addMigration('patient_reports');
  }

  // Users table (admin authentication)
  if (!hasMigration('users')) {
    database.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    addMigration('users');
  }

  // Phase 4: Inventory
  if (!hasMigration('inventory_items')) {
    database.exec(`
      CREATE TABLE inventory_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        minimum_stock INTEGER DEFAULT 0,
        supplier TEXT,
        last_updated TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory_items(name);
    `);
    addMigration('inventory_items');
  }
}

export { runExtensionMigrations };
