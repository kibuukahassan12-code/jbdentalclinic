import { Router } from 'express';
import {
  getTreatments,
  getTreatmentById,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} from '../db.js';
import { validateTreatmentBody } from '../middleware/validate-treatment.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { patient_id, dentist_id, treatment_plan_id, limit, offset } = req.query;
    const list = getTreatments({
      patient_id: patient_id != null ? Number(patient_id) : undefined,
      dentist_id: dentist_id != null ? Number(dentist_id) : undefined,
      treatment_plan_id: treatment_plan_id != null ? Number(treatment_plan_id) : undefined,
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
    const row = getTreatmentById(id);
    if (!row) return res.status(404).json({ error: 'Treatment not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateTreatmentBody, (req, res) => {
  try {
    const id = createTreatment(req.validated);
    const row = getTreatmentById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateTreatmentBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getTreatmentById(id);
    if (!existing) return res.status(404).json({ error: 'Treatment not found' });
    updateTreatment(id, req.validated);
    const row = getTreatmentById(id);
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
    const existing = getTreatmentById(id);
    if (!existing) return res.status(404).json({ error: 'Treatment not found' });
    deleteTreatment(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
