import { Router } from 'express';
import { getAllSettings, getSetting, setSetting, deleteSetting } from '../db.js';

const router = Router();

const DEFAULT_SETTINGS = {
  clinic_name: 'JB Dental Clinic',
  clinic_address: 'Kampala, Uganda',
  clinic_phone: '',
  clinic_email: 'info@jbdental.ug',
  clinic_working_hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
  currency: 'UGX',
  tax_rate: '0',
  timezone: 'Africa/Kampala',
  date_format: 'YYYY-MM-DD',
  time_format: '24h',
  email_notifications: 'true',
  whatsapp_notifications: 'true',
  auto_reminders: 'true',
  invoice_prefix: 'INV',
  receipt_prefix: 'RCP',
};

router.get('/', (req, res) => {
  try {
    const settings = getAllSettings();
    const settingsMap = { ...DEFAULT_SETTINGS };
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    res.json(settingsMap);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:key', (req, res) => {
  try {
    const { key } = req.params;
    const value = getSetting(key);
    if (value === null) {
      if (DEFAULT_SETTINGS[key] !== undefined) {
        return res.json({ key, value: DEFAULT_SETTINGS[key], isDefault: true });
      }
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ key, value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:key', (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined || value === null) {
      return res.status(400).json({ error: 'Value is required' });
    }
    setSetting(key, String(value));
    res.json({ key, value: String(value), updated: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/', (req, res) => {
  try {
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }
    const results = [];
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined && value !== null) {
        setSetting(key, String(value));
        results.push({ key, value: String(value) });
      }
    }
    res.json({ updated: results.length, settings: results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:key', (req, res) => {
  try {
    const { key } = req.params;
    const existing = getSetting(key);
    if (!existing) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    deleteSetting(key);
    res.json({ key, deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
