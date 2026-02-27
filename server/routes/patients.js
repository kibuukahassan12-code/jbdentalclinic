import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  searchPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getDb,
} from '../db.js';
import { validatePatientBody } from '../middleware/validate-patient.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { q, limit, offset } = req.query;
    const list = q
      ? searchPatients(q)
      : getPatients({ limit: limit ? Math.min(Number(limit), 500) : 100, offset: offset ? Number(offset) : 0 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const row = getPatientById(id);
    if (!row) return res.status(404).json({ error: 'Patient not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validatePatientBody, (req, res) => {
  try {
    const id = createPatient(req.validated);
    const row = getPatientById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validatePatientBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getPatientById(id);
    if (!existing) return res.status(404).json({ error: 'Patient not found' });
    updatePatient(id, req.validated);
    const row = getPatientById(id);
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getPatientById(id);
    if (!existing) return res.status(404).json({ error: 'Patient not found' });

    // Check for related records before deletion
    const db = getDb();
    const refs = [];
    const count = (table, col) => db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${col} = ?`).get(id)?.n || 0;
    const appts = count('appointments', 'patient_id');
    if (appts) refs.push(`${appts} appointment(s)`);
    const treats = count('treatments', 'patient_id');
    if (treats) refs.push(`${treats} treatment(s)`);
    const invs = count('invoices', 'patient_id');
    if (invs) refs.push(`${invs} invoice(s)`);
    const plans = count('treatment_plans', 'patient_id');
    if (plans) refs.push(`${plans} treatment plan(s)`);
    const charts = count('dental_chart', 'patient_id');
    if (charts) refs.push(`${charts} dental chart entry(ies)`);
    const reports = count('patient_reports', 'patient_id');
    if (reports) refs.push(`${reports} patient report(s)`);

    if (refs.length) {
      return res.status(409).json({
        error: `Cannot delete patient. Related records exist: ${refs.join(', ')}. Remove related records first.`
      });
    }

    deletePatient(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
