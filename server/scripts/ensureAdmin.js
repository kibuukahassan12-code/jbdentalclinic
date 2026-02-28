import bcrypt from 'bcrypt';
import { getDb, initDb } from '../db.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/admin.js';

export async function ensureAdmin() {
  const db = getDb();

  const email = ADMIN_EMAIL.trim().toLowerCase();

  const existing = db.prepare('SELECT id, email, password, role FROM users WHERE email = ?').get(email);

  const desiredPassword = String(ADMIN_PASSWORD ?? '');
  const desiredRole = 'admin';

  if (existing) {
    let needsUpdate = false;

    if (existing.role !== desiredRole) {
      needsUpdate = true;
    }

    try {
      const matches = await bcrypt.compare(desiredPassword, existing.password);
      if (!matches) {
        needsUpdate = true;
      }
    } catch {
      needsUpdate = true;
    }

    if (!needsUpdate) {
      console.log('Admin already exists:', email);
      return;
    }

    const hash = await bcrypt.hash(desiredPassword, 10);
    db.prepare('UPDATE users SET password = ?, role = ? WHERE id = ?').run(hash, desiredRole, existing.id);
    console.log('Admin account updated:', email);
    return;
  }

  const hash = await bcrypt.hash(desiredPassword, 10);
  db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(email, hash, desiredRole);
  console.log('Admin account created:', email);
}

// Allow running standalone: node server/scripts/ensureAdmin.js
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  initDb();
  ensureAdmin().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
