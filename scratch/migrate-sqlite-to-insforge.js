import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbPath = path.join(__dirname, '../data/appointments.db');
const db = new Database(dbPath);

const INSFORGE_URL = process.env.VITE_INSFORGE_URL || 'https://83qmtmx2.us-east.insforge.app';
const ANON_KEY = process.env.VITE_INSFORGE_ANON_KEY;

if (!ANON_KEY) {
  console.error("VITE_INSFORGE_ANON_KEY is missing in .env");
  process.exit(1);
}

const tables = [
  'patients',
  'staff',
  'appointments',
  'treatment_plans',
  'treatments',
  'dental_chart',
  'invoices',
  'payments',
  'patient_reports',
  'inventory_items',
  'settings',
  'communication_logs',
  'audit_logs',
  'users',
  'expenses'
];

async function migrateTable(tableName) {
  // Check if table exists in SQLite
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(tableName);
  if (!tableCheck) {
    console.log(`Table ${tableName} does not exist in SQLite database. Skipping.`);
    return;
  }

  // Fetch all rows
  const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
  console.log(`Found ${rows.length} rows in SQLite table "${tableName}"`);

  if (rows.length === 0) {
    console.log(`Table ${tableName} has no rows. Skipping migration.`);
    return;
  }

  // Map SQLite values to PostgreSQL types if needed
  // SQLite doesn't enforce strict types, but PostgreSQL does.
  // We need to handle null / undefined and boolean/integer conversions.
  const formattedRows = rows.map(row => {
    const newRow = { ...row };
    // PostgreSQL doesn't like empty strings for numbers, etc.
    // Also, handle field conversions if necessary.
    return newRow;
  });

  // POST rows in chunks of 50 to avoid payload size limit
  const chunkSize = 50;
  for (let i = 0; i < formattedRows.length; i += chunkSize) {
    const chunk = formattedRows.slice(i, i + chunkSize);
    console.log(`Migrating chunk ${i / chunkSize + 1} of ${Math.ceil(formattedRows.length / chunkSize)} for "${tableName}"`);

    const url = `${INSFORGE_URL}/api/database/records/${tableName}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(chunk)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Error migrating chunk to "${tableName}":`, text);
      throw new Error(`Failed to migrate table "${tableName}"`);
    }
  }

  console.log(`Successfully migrated table "${tableName}"`);
}

async function main() {
  try {
    for (const table of tables) {
      await migrateTable(table);
    }
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
