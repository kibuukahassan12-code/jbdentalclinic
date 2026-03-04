import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchTerm = `%${q.trim()}%`;
    const maxResults = Math.min(Number(limit) || 20, 50);
    const db = getDb();
    
    const results = {
      patients: [],
      appointments: [],
      staff: [],
      invoices: [],
      treatments: [],
      total: 0,
    };

    // Search patients
    results.patients = db.prepare(`
      SELECT id, full_name as name, phone, email, 'patient' as type
      FROM patients 
      WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ?
      LIMIT ?
    `).all(searchTerm, searchTerm, searchTerm, maxResults);

    // Search appointments
    results.appointments = db.prepare(`
      SELECT 
        a.id, 
        a.patient_name as name, 
        a.patient_phone as phone,
        a.appointment_date as date,
        a.appointment_time as time,
        a.status,
        'appointment' as type
      FROM appointments a
      WHERE a.patient_name LIKE ? OR a.patient_phone LIKE ? OR a.service LIKE ?
      ORDER BY a.appointment_date DESC
      LIMIT ?
    `).all(searchTerm, searchTerm, searchTerm, maxResults);

    // Search staff
    results.staff = db.prepare(`
      SELECT id, full_name as name, phone, email, role, 'staff' as type
      FROM staff
      WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR role LIKE ?
      LIMIT ?
    `).all(searchTerm, searchTerm, searchTerm, searchTerm, maxResults);

    // Search invoices (by patient name via join)
    results.invoices = db.prepare(`
      SELECT 
        i.id,
        p.full_name as name,
        i.total_amount,
        i.status,
        i.created_at as date,
        'invoice' as type
      FROM invoices i
      JOIN patients p ON i.patient_id = p.id
      WHERE p.full_name LIKE ?
      ORDER BY i.created_at DESC
      LIMIT ?
    `).all(searchTerm, maxResults);

    // Search treatments
    results.treatments = db.prepare(`
      SELECT 
        t.id,
        p.full_name as name,
        t.service_name as service,
        t.treatment_date as date,
        t.status,
        'treatment' as type
      FROM treatments t
      JOIN patients p ON t.patient_id = p.id
      WHERE p.full_name LIKE ? OR t.service_name LIKE ?
      ORDER BY t.treatment_date DESC
      LIMIT ?
    `).all(searchTerm, searchTerm, maxResults);

    results.total = results.patients.length + results.appointments.length + 
                   results.staff.length + results.invoices.length + results.treatments.length;

    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
