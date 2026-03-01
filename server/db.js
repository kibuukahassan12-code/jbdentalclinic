import Database from 'better-sqlite3';
import fs from 'fs';
import nodePath from 'path';
import { fileURLToPath } from 'url';

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));
const filename = process.env.DATABASE_PATH ||
  nodePath.join(__dirname, '..', 'data', 'jb_dental_clinic.sqlite');

fs.mkdirSync(nodePath.dirname(filename), { recursive: true });

const db = new Database(filename);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    medical_history TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS dentists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    specialization TEXT,
    phone TEXT,
    email TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    dentist_id INTEGER,
    appointment_date TEXT,
    appointment_time TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (dentist_id) REFERENCES dentists(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS treatments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    treatment_name TEXT NOT NULL,
    description TEXT,
    cost REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER,
    total_amount REAL NOT NULL,
    paid_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'unpaid',
    issued_at TEXT DEFAULT (datetime('now')),
    due_date TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
  );
`);

export default db;
