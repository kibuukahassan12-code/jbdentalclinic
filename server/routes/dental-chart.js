import { Router } from 'express';
import {
  getDentalChartEntries,
  getDentalChartEntryById,
  createDentalChartEntry,
  updateDentalChartEntry,
  deleteDentalChartEntry,
} from '../db.js';
import { validateDentalChartBody } from '../middleware/validate-dental-chart.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { patient_id, limit, offset } = req.query;
    const list = getDentalChartEntries({
      patient_id: patient_id != null ? Number(patient_id) : undefined,
      limit: limit ? Math.min(Number(limit), 500) : 200,
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
    const row = getDentalChartEntryById(id);
    if (!row) return res.status(404).json({ error: 'Dental chart entry not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateDentalChartBody, (req, res) => {
  try {
    const id = createDentalChartEntry(req.validated);
    const row = getDentalChartEntryById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateDentalChartBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getDentalChartEntryById(id);
    if (!existing) return res.status(404).json({ error: 'Dental chart entry not found' });
    updateDentalChartEntry(id, req.validated);
    const row = getDentalChartEntryById(id);
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
    const existing = getDentalChartEntryById(id);
    if (!existing) return res.status(404).json({ error: 'Dental chart entry not found' });
    deleteDentalChartEntry(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
