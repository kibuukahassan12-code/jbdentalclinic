import { Router } from 'express';
import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
} from '../db.js';
import { validateInventoryItemBody } from '../middleware/validate-inventory.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { limit, offset, low_stock_only } = req.query;
    const list = getInventoryItems({
      limit: limit ? Math.min(Number(limit), 500) : 100,
      offset: offset ? Number(offset) : 0,
      low_stock_only: low_stock_only === 'true' || low_stock_only === '1',
    });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/low-stock', (req, res) => {
  try {
    const list = getLowStockItems();
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
    const row = getInventoryItemById(id);
    if (!row) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateInventoryItemBody, (req, res) => {
  try {
    const id = createInventoryItem(req.validated);
    const row = getInventoryItemById(id);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateInventoryItemBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getInventoryItemById(id);
    if (!existing) return res.status(404).json({ error: 'Inventory item not found' });
    updateInventoryItem(id, req.validated);
    const row = getInventoryItemById(id);
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
    const existing = getInventoryItemById(id);
    if (!existing) return res.status(404).json({ error: 'Inventory item not found' });
    deleteInventoryItem(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
