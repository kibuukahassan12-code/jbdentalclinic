import { Router } from 'express';
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from '../db.js';
import { validatePaymentBody } from '../middleware/validate-payment.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { invoice_id, limit, offset } = req.query;
    const list = getPayments({
      invoice_id: invoice_id != null ? Number(invoice_id) : undefined,
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
    const row = getPaymentById(id);
    if (!row) return res.status(404).json({ error: 'Payment not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validatePaymentBody, (req, res) => {
  try {
    const id = createPayment(req.validated);
    const row = getPaymentById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validatePaymentBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getPaymentById(id);
    if (!existing) return res.status(404).json({ error: 'Payment not found' });
    updatePayment(id, req.validated);
    const row = getPaymentById(id);
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
    const existing = getPaymentById(id);
    if (!existing) return res.status(404).json({ error: 'Payment not found' });
    deletePayment(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
