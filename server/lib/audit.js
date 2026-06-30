import { logAudit } from '../db.js';

const REDACTED_FIELDS = new Set(['password', 'token', 'apiKey']);

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        if (REDACTED_FIELDS.has(key)) {
          return [key, '[REDACTED]'];
        }

        return [key, sanitizeValue(nestedValue)];
      })
    );
  }

  return value;
}

export function getAuditActor(req, fallback = {}) {
  return {
    user_id: fallback.user_id ?? req.user?.userId ?? req.user?.id ?? null,
    user_email: fallback.user_email ?? req.user?.sub ?? req.user?.email ?? null,
    ip_address: req.ip ?? null,
    user_agent: req.get('user-agent') || null,
  };
}

export function writeAuditLog(req, details = {}) {
  try {
    return logAudit({
      ...getAuditActor(req, details.actor),
      action: details.action,
      entity_type: details.entity_type,
      entity_id: details.entity_id ?? null,
      old_values: details.old_values ? sanitizeValue(details.old_values) : null,
      new_values: details.new_values ? sanitizeValue(details.new_values) : null,
    });
  } catch (error) {
    console.error('Audit log write failed:', error);
    return null;
  }
}
