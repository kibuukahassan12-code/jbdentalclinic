import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/appointments.db');
const db = new Database(dbPath);

console.log("Checkpointing database...");
try {
  const result = db.prepare("PRAGMA wal_checkpoint(FULL)").get();
  console.log("Checkpoint result:", result);

  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Available tables:");
  for (const t of tables) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${t.name}`).get().count;
    console.log(`- ${t.name}: ${count} rows`);
  }
} catch (e) {
  console.error("Error:", e);
}
