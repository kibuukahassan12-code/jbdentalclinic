import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  try {
    const appointments = db.prepare(`
      SELECT a.*, p.first_name || ' ' || p.last_name AS patient_name,
             d.first_name || ' ' || d.last_name AS dentist_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN dentists d ON a.dentist_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const appointment = db.prepare(`
      SELECT a.*, p.first_name || ' ' || p.last_name AS patient_name,
             d.first_name || ' ' || d.last_name AS dentist_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN dentists d ON a.dentist_id = d.id
      WHERE a.id = ?
    `).get(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, email, phone, date, time, service, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'name and phone are required' });
    }

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '-';

    let patient = db.prepare('SELECT id FROM patients WHERE phone = ?').get(phone);
    if (!patient) {
      const result = db.prepare(
        'INSERT INTO patients (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)'
      ).run(firstName, lastName, phone, email || '');
      patient = { id: result.lastInsertRowid };
    }

    const defaultDentist = db.prepare('SELECT id FROM dentists LIMIT 1').get();
    const dentistId = defaultDentist ? defaultDentist.id : null;

    const result = db.prepare(`
      INSERT INTO appointments (patient_id, dentist_id, appointment_date, appointment_time, notes, status)
      VALUES (?, ?, ?, ?, ?, 'scheduled')
    `).run(patient.id, dentistId, date || null, time || null, `Service: ${service || 'Not specified'}. ${message || ''}`.trim());

    res.status(201).json({ id: result.lastInsertRowid, message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }
    const result = db.prepare(`
      UPDATE appointments SET status = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
