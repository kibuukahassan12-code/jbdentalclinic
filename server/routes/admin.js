import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/stats', (_req, res) => {
  try {
    const total_patients = db.prepare('SELECT COUNT(*) as c FROM patients').get().c;
    const total_appointments = db.prepare('SELECT COUNT(*) as c FROM appointments').get().c;
    const completed_appointments = db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status = 'completed'").get().c;
    const upcoming_appointments = db.prepare(
      "SELECT COUNT(*) as c FROM appointments WHERE status IN ('scheduled','confirmed')"
    ).get().c;

    res.json({ total_patients, total_appointments, completed_appointments, upcoming_appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
