import { Router } from 'express';
import {
  getTreatmentPlans,
  getTreatmentPlanById,
  createTreatmentPlan,
  updateTreatmentPlan,
  deleteTreatmentPlan,
} from '../db.js';
import { validateTreatmentPlanBody } from '../middleware/validate-treatment-plan.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { patient_id, limit, offset } = req.query;
    const list = getTreatmentPlans({
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
    const row = getTreatmentPlanById(id);
    if (!row) return res.status(404).json({ error: 'Treatment plan not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateTreatmentPlanBody, (req, res) => {
  try {
    const id = createTreatmentPlan(req.validated);
    const row = getTreatmentPlanById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateTreatmentPlanBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getTreatmentPlanById(id);
    if (!existing) return res.status(404).json({ error: 'Treatment plan not found' });
    updateTreatmentPlan(id, req.validated);
    const row = getTreatmentPlanById(id);
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
    const existing = getTreatmentPlanById(id);
    if (!existing) return res.status(404).json({ error: 'Treatment plan not found' });
    deleteTreatmentPlan(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
