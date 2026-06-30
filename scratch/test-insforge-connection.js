import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

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

async function testTable(tableName) {
  const url = `${INSFORGE_URL}/api/database/records/${tableName}?limit=1`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Table "${tableName}" exists (Status ${res.status}). Rows: ${data.length}`);
      return true;
    } else {
      const text = await res.text();
      console.log(`❌ Table "${tableName}" failed (Status ${res.status}): ${text.substring(0, 100)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Table "${tableName}" connection error:`, error.message);
    return false;
  }
}

async function run() {
  console.log(`Testing InsForge connection to: ${INSFORGE_URL}`);
  let successCount = 0;
  for (const table of tables) {
    const ok = await testTable(table);
    if (ok) successCount++;
  }
  console.log(`Summary: ${successCount}/${tables.length} tables are accessible.`);
}

run();
