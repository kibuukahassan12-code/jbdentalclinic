import { Router } from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getTotalPaidForInvoice,
  getDb,
} from '../db.js';
import { validateInvoiceBody } from '../middleware/validate-invoice.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { patient_id, status, limit, offset } = req.query;
    const list = getInvoices({
      patient_id: patient_id != null ? Number(patient_id) : undefined,
      status: status || undefined,
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
    const row = getInvoiceById(id);
    if (!row) return res.status(404).json({ error: 'Invoice not found' });
    const paid = getTotalPaidForInvoice(id);
    res.json({ ...row, total_paid: paid });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateInvoiceBody, (req, res) => {
  try {
    const id = createInvoice(req.validated);
    const row = getInvoiceById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateInvoiceBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getInvoiceById(id);
    if (!existing) return res.status(404).json({ error: 'Invoice not found' });
    updateInvoice(id, req.validated);
    const row = getInvoiceById(id);
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
    const existing = getInvoiceById(id);
    if (!existing) return res.status(404).json({ error: 'Invoice not found' });

    // Check for related payments before deletion
    const db = getDb();
    const paymentCount = db.prepare('SELECT COUNT(*) AS n FROM payments WHERE invoice_id = ?').get(id)?.n || 0;
    if (paymentCount > 0) {
      return res.status(409).json({
        error: `Cannot delete invoice. ${paymentCount} payment(s) are linked to this invoice. Remove payments first.`
      });
    }

    deleteInvoice(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
