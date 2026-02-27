import { Router } from 'express';
import {
  getPatientReports,
  getPatientReportById,
  createPatientReport,
  updatePatientReport,
  deletePatientReport,
} from '../db.js';
import { validatePatientReportBody } from '../middleware/validate-patient-report.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { patient_id, limit, offset } = req.query;
    const list = getPatientReports({
      patient_id: patient_id != null ? Number(patient_id) : undefined,
      limit: limit ? Math.min(Number(limit), 500) : 100,
      offset: offset ? Number(offset) : 0,
    });
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
    const row = getPatientReportById(id);
    if (!row) return res.status(404).json({ error: 'Patient report not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validatePatientReportBody, (req, res) => {
  try {
    const id = createPatientReport(req.validated);
    const row = getPatientReportById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validatePatientReportBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getPatientReportById(id);
    if (!existing) return res.status(404).json({ error: 'Patient report not found' });
    updatePatientReport(id, req.validated);
    const row = getPatientReportById(id);
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
    const existing = getPatientReportById(id);
    if (!existing) return res.status(404).json({ error: 'Patient report not found' });
    deletePatientReport(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
