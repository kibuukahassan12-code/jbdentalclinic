import bcrypt from 'bcrypt';
import { getDb, initDb } from '../db.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/admin.js';

export async function ensureAdmin() {
  const db = getDb();

  const email = ADMIN_EMAIL.trim().toLowerCase();

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

  if (existing) {
    console.log('Admin already exists:', email);
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(
    email,
    hash,
    'admin'
  );

  console.log('Admin account created:', ADMIN_EMAIL);
}

// Allow running standalone: node server/scripts/ensureAdmin.js
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  initDb();
  ensureAdmin().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
