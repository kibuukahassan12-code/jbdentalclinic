import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/admin.js';

export function requireApiKey(req, res, next) {
  const provided =
    req.headers['x-api-key'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '');

  if (!provided) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Try JWT verification first
  try {
    const decoded = jwt.verify(provided, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_jwtErr) {
    // Not a valid JWT – fall through to legacy API key check
  }

  // Legacy API key check
  const key = process.env.ADMIN_API_KEY;
  if (key && provided === key) {
    req.user = { sub: 'api-key', role: 'admin' };
    return next();
  }

  return res.status(401).json({ error: 'Invalid or expired token' });
}

function normalizeRoles(roles) {
  return roles
    .flat()
    .map((role) => String(role || '').trim().toLowerCase())
    .filter(Boolean);
}

export function requireRoles(...allowedRoles) {
  const normalizedRoles = normalizeRoles(allowedRoles);

  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const currentRole = String(req.user.role).trim().toLowerCase();
    if (!normalizedRoles.includes(currentRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export const requireAdmin = requireRoles('admin');
