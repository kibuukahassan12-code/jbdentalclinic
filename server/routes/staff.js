import { Router } from 'express';
import {
  getStaff,
  getStaffMemberById,
  createStaff,
  updateStaff,
  deleteStaff,
  getDb,
} from '../db.js';
import { validateStaffBody } from '../middleware/validate-staff.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { role, is_active, limit, offset } = req.query;
    const isActive =
      is_active === undefined
        ? undefined
        : is_active === 'true' || is_active === '1';
    const list = getStaff({
      role: role || undefined,
      is_active: isActive,
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
    const row = getStaffMemberById(id);
    if (!row) return res.status(404).json({ error: 'Staff member not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateStaffBody, (req, res) => {
  try {
    const id = createStaff(req.validated);
    const row = getStaffMemberById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateStaffBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getStaffMemberById(id);
    if (!existing)
      return res.status(404).json({ error: 'Staff member not found' });
    updateStaff(id, req.validated);
    const row = getStaffMemberById(id);
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
    const existing = getStaffMemberById(id);
    if (!existing)
      return res.status(404).json({ error: 'Staff member not found' });

    // Check for related records before deletion
    const db = getDb();
    const refs = [];
    const count = (table, col) => db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${col} = ?`).get(id)?.n || 0;
    const appts = count('appointments', 'dentist_id');
    if (appts) refs.push(`${appts} appointment(s)`);
    const treats = count('treatments', 'dentist_id');
    if (treats) refs.push(`${treats} treatment(s)`);
    const reports = count('patient_reports', 'doctor_id');
    if (reports) refs.push(`${reports} patient report(s)`);

    if (refs.length) {
      return res.status(409).json({
        error: `Cannot delete staff member. Related records exist: ${refs.join(', ')}. Remove related records first.`
      });
    }

    deleteStaff(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
