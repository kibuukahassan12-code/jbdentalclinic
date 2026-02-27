/**
 * Ugandan sample data for JB Dental Clinic admin panel.
 * Run once: node server/seed-sample-data.js
 * Or call POST /api/seed/sample (with X-Api-Key) to seed from admin.
 */
import { initDb, getDb } from './db.js';

const PATIENTS = [
  { full_name: 'Nakato Grace', phone: '256752001269', email: 'nakato.g@example.com', date_of_birth: '1990-05-12', gender: 'Female' },
  { full_name: 'Okello James', phone: '256772123456', email: 'okello.j@example.com', date_of_birth: '1985-08-20', gender: 'Male' },
  { full_name: 'Kintu David', phone: '256701234567', email: 'kintu.d@example.com', date_of_birth: '1992-03-15', gender: 'Male' },
  { full_name: 'Nansubuga Sarah', phone: '256783456789', email: 'nansubuga.s@example.com', date_of_birth: '1988-11-08', gender: 'Female' },
  { full_name: 'Mukasa Peter', phone: '256754567890', email: 'mukasa.p@example.com', date_of_birth: '1979-07-22', gender: 'Male' },
];

const STAFF = [
  { full_name: 'Dr. Betty Namukasa', role: 'Dentist', phone: '256752000001', email: 'dr.namukasa@jbdental.ug', salary: 2500000, is_active: 1 },
  { full_name: 'Dr. Robert Ssebunya', role: 'Dentist', phone: '256752000002', email: 'dr.ssebunya@jbdental.ug', salary: 2400000, is_active: 1 },
  { full_name: 'Nalwadda Mary', role: 'Nurse', phone: '256752000003', email: 'mary.n@jbdental.ug', salary: 800000, is_active: 1 },
  { full_name: 'Tumusiime Grace', role: 'Receptionist', phone: '256752000004', email: 'grace.t@jbdental.ug', salary: 600000, is_active: 1 },
];

function runSeed() {
  const db = getDb();

  // Check if we already have data
  const patientCount = db.prepare('SELECT COUNT(*) as c FROM patients').get();
  if (patientCount.c > 0) {
    console.log('Sample data already present. Skip seeding.');
    return { skipped: true, reason: 'data_exists' };
  }

  const insertPatient = db.prepare(`
    INSERT INTO patients (full_name, phone, email, date_of_birth, gender) VALUES (?, ?, ?, ?, ?)
  `);
  for (const p of PATIENTS) {
    insertPatient.run(p.full_name, p.phone, p.email || null, p.date_of_birth || null, p.gender || null);
  }
  console.log(`Inserted ${PATIENTS.length} patients.`);

  const insertStaff = db.prepare(`
    INSERT INTO staff (full_name, role, phone, email, salary, is_active) VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const s of STAFF) {
    insertStaff.run(s.full_name, s.role, s.phone || null, s.email || null, s.salary ?? null, s.is_active !== undefined ? s.is_active : 1);
  }
  console.log(`Inserted ${STAFF.length} staff.`);

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const getPatientId = (i) => db.prepare('SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET ?').get(i)?.id;
  const getDentistId = () => db.prepare("SELECT id FROM staff WHERE role = 'Dentist' LIMIT 1").get()?.id;
  const dentistId = getDentistId();

  const insertApt = db.prepare(`
    INSERT INTO appointments (patient_name, patient_phone, appointment_date, appointment_time, service, patient_id, dentist_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertApt.run(PATIENTS[0].full_name, PATIENTS[0].phone, tomorrow, '09:00', 'General checkup', getPatientId(0), dentistId, 'Confirmed');
  insertApt.run(PATIENTS[1].full_name, PATIENTS[1].phone, tomorrow, '10:30', 'Dental cleaning', getPatientId(1), dentistId, 'Pending');
  insertApt.run(PATIENTS[2].full_name, PATIENTS[2].phone, today, '14:00', 'Consultation', getPatientId(2), dentistId, 'Completed');
  console.log('Inserted 3 appointments.');

  const insertInv = db.prepare(`
    INSERT INTO invoices (patient_id, total_amount, discount, tax, status) VALUES (?, ?, ?, ?, ?)
  `);
  insertInv.run(getPatientId(0), 150000, 0, 0, 'Paid');
  insertInv.run(getPatientId(1), 200000, 10000, 0, 'Partially Paid');
  insertInv.run(getPatientId(2), 80000, 0, 0, 'Pending');
  console.log('Inserted 3 invoices.');

  const insertPay = db.prepare(`
    INSERT INTO payments (invoice_id, amount, payment_method, paid_at) VALUES (?, ?, ?, datetime('now'))
  `);
  insertPay.run(1, 150000, 'Mobile Money');
  insertPay.run(2, 100000, 'Cash');
  console.log('Inserted 2 payments.');

  const insertTreatment = db.prepare(`
    INSERT INTO treatments (patient_id, dentist_id, service_name, description, cost, treatment_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertTreatment.run(getPatientId(2), dentistId, 'Consultation', 'Initial checkup', 80000, today, 'Completed');
  insertTreatment.run(getPatientId(0), dentistId, 'Scaling', 'Dental cleaning', 150000, today, 'Completed');
  console.log('Inserted 2 treatments.');

  const insertInvItem = db.prepare(`
    INSERT INTO inventory_items (name, quantity, minimum_stock, supplier) VALUES (?, ?, ?, ?)
  `);
  insertInvItem.run('Dental gloves (M)', 200, 50, 'Medix Uganda');
  insertInvItem.run('Masks (surgical)', 500, 100, 'Medix Uganda');
  insertInvItem.run('Cotton rolls', 1000, 200, 'Dental Supplies Ltd');
  console.log('Inserted 3 inventory items.');

  return { ok: true, patients: PATIENTS.length, staff: STAFF.length };
}

export function runSampleSeed() {
  return runSeed();
}

if (process.argv[1]?.endsWith('seed-sample-data.js')) {
  initDb();
  const result = runSeed();
  console.log('Seed result:', result);
}
