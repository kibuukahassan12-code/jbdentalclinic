import { Router } from 'express';
import { runSampleSeed } from '../seed-sample-data.js';
import { getDb } from '../db.js';

const router = Router();

router.post('/sample', (req, res) => {
  try {
    const result = runSampleSeed();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
