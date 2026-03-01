import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  try {
    const patients = db.prepare(`
      SELECT p.*,
        COUNT(a.id) AS appointment_count
      FROM patients p
      LEFT JOIN appointments a ON a.patient_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const appointments = db.prepare(`
      SELECT a.*, d.first_name || ' ' || d.last_name AS dentist_name
      FROM appointments a
      LEFT JOIN dentists d ON a.dentist_id = d.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC
    `).all(req.params.id);

    res.json({ ...patient, appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, address, medical_history } = req.body;
    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'first_name and last_name are required' });
    }
    const result = db.prepare(`
      INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, date_of_birth || null, gender || null, phone || null, email || null, address || null, medical_history || null);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, email, address, medical_history } = req.body;
    const result = db.prepare(`
      UPDATE patients SET
        first_name = ?, last_name = ?, date_of_birth = ?, gender = ?,
        phone = ?, email = ?, address = ?, medical_history = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(first_name, last_name, date_of_birth || null, gender || null, phone || null, email || null, address || null, medical_history || null, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
