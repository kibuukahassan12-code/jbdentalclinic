import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.ADMIN_API_KEY || 'fallback-secret-change-me';
const JWT_EXPIRY = '8h';

/**
 * Admin login: username + password from env.
 * On success returns a signed JWT token for subsequent API calls.
 * Set ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_API_KEY in .env
 */
router.post('/login', (req, res) => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return res.status(503).json({ error: 'Admin login not configured' });
  }

  const { username: u, password: p } = req.body || {};
  if (!u || !p) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (String(u).trim() !== username || String(p) !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { sub: username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  res.json({ success: true, token, expiresIn: JWT_EXPIRY });
});

export default router;
