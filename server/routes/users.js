import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, getUserByEmail } from '../db.js';

const router = Router();

const ROLES = ['admin', 'staff', 'receptionist', 'dentist'];

router.get('/', (req, res) => {
  try {
    const { limit, offset, role } = req.query;
    const users = getUsers({
      limit: limit ? Math.min(Number(limit), 500) : 100,
      offset: offset ? Number(offset) : 0,
      role,
    });
    res.json(users);
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
    const user = getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be one of: ' + ROLES.join(', ') });
    }
    const existing = getUserByEmail(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const id = await createUser({ email, password, role });
    const user = getUserById(id);
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const { email, password, role } = req.body;
    if (role && !ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be one of: ' + ROLES.join(', ') });
    }
    const user = await updateUser(id, { email, password, role });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
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
    const user = getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Prevent deleting the last admin
    const admins = getUsers({ role: 'admin' });
    if (user.role === 'admin' && admins.length <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin user' });
    }
    deleteUser(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
