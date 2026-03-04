import { Router } from 'express';
import { getAuditLogs, getAuditStats } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { limit, offset, user_id, entity_type, action } = req.query;
    const logs = getAuditLogs({
      limit: limit ? Math.min(Number(limit), 500) : 100,
      offset: offset ? Number(offset) : 0,
      user_id: user_id ? Number(user_id) : undefined,
      entity_type,
      action,
    });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = getAuditStats();
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
