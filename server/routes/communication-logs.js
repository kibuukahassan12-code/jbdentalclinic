import { Router } from 'express';
import { getCommunicationLogs, getCommunicationStats, logCommunication } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { limit, offset, patient_id, appointment_id, type, status } = req.query;
    const logs = getCommunicationLogs({
      limit: limit ? Math.min(Number(limit), 500) : 100,
      offset: offset ? Number(offset) : 0,
      patient_id: patient_id ? Number(patient_id) : undefined,
      appointment_id: appointment_id ? Number(appointment_id) : undefined,
      type,
      status,
    });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = getCommunicationStats();
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { appointment_id, patient_id, patient_name, patient_phone, type, channel, status, message, error } = req.body;
    if (!type || !channel || !status) {
      return res.status(400).json({ error: 'type, channel, and status are required' });
    }
    const id = logCommunication({
      appointment_id,
      patient_id,
      patient_name,
      patient_phone,
      type,
      channel,
      status,
      message,
      error,
    });
    res.status(201).json({ id, created: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
