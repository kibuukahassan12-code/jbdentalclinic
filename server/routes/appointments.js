import { Router } from 'express';
import { getDb } from '../db.js';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatients,
  getPatientByPhone,
  createPatient,
} from '../db.js';
import { validateAppointmentBody } from '../middleware/validate.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { date, from_date: fromDate, to_date: toDate, limit, offset } = req.query;
    const list = getAppointments({
      date: date || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
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
    const row = getAppointmentById(id);
    if (!row) return res.status(404).json({ error: 'Appointment not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', validateAppointmentBody, async (req, res) => {
  try {
    // Auto-create patient if they don't exist when booking
    let patientId = req.validated.patient_id;
    const phone = req.validated.patient_phone;

    // Check if patient already exists
    if (!patientId && phone) {
      const existingPatient = getPatientByPhone(phone);
      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        // Create new patient record
        const newPatientId = createPatient({
          full_name: req.validated.patient_name,
          phone: phone,
        });
        patientId = newPatientId;
        console.log(`✅ Auto-created patient: ${req.validated.patient_name} (ID: ${newPatientId})`);
      }
    }

    // Add patient_id to validated data
    const appointmentData = {
      ...req.validated,
      patient_id: patientId,
    };

    const id = createAppointment(appointmentData);
    const row = getAppointmentById(id);

    // Send WhatsApp thank you message immediately
    if (row && row.patient_phone && row.patient_name) {
      try {
        const { sendThankYouMessage } = await import('../lib/whatsapp.js');
        await sendThankYouMessage(
          row.patient_phone,
          row.patient_name,
          row.appointment_date,
          row.appointment_time
        );

        // Mark as sent in database
        const { getDb } = await import('../db.js');
        const db = getDb();
        db.prepare(`
          UPDATE appointments 
          SET thank_you_sent_at = datetime('now') 
          WHERE id = ?
        `).run(id);

        console.log(`✅ Thank you WhatsApp sent to ${row.patient_name} (${row.patient_phone})`);
      } catch (whatsappError) {
        console.error('WhatsApp thank you message failed:', whatsappError.message);
        // Don't fail the appointment creation if WhatsApp fails
      }
    }

    res.status(201).json(getAppointmentById(id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', validateAppointmentBody, (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = getAppointmentById(id);
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });
    updateAppointment(id, req.validated);
    const row = getAppointmentById(id);
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
    const existing = getAppointmentById(id);
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });
    deleteAppointment(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Update appointment status
 * Status flow: Scheduled → Confirmed → Completed / Cancelled
 */
router.patch('/:id/status', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const { status } = req.body;
    const validStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = getAppointmentById(id);
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    const db = getDb();
    db.prepare(`
      UPDATE appointments 
      SET status = ?, updated_at = datetime('now') 
      WHERE id = ?
    `).run(status, id);

    res.json({ success: true, id, status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * Manually send reminder for an appointment
 */
router.post('/:id/send-reminder', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { reminderType } = req.body; // 'thank_you', '1day', '6h', '1h'
    const validTypes = ['thank_you', '1day', '6h', '1h'];

    if (reminderType && !validTypes.includes(reminderType)) {
      return res.status(400).json({
        error: `Invalid reminder type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    const appointment = getAppointmentById(id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    const { sendThankYouMessage, send1DayReminder, send6HourReminder, send1HourReminder } = await import('../lib/whatsapp.js');

    let sent = false;
    let messageType = reminderType || 'thank_you';

    try {
      switch (messageType) {
        case '1day':
          await send1DayReminder(
            appointment.patient_phone,
            appointment.patient_name,
            appointment.appointment_date,
            appointment.appointment_time
          );
          break;
        case '6h':
          await send6HourReminder(
            appointment.patient_phone,
            appointment.patient_name,
            appointment.appointment_date,
            appointment.appointment_time
          );
          break;
        case '1h':
          await send1HourReminder(
            appointment.patient_phone,
            appointment.patient_name,
            appointment.appointment_date,
            appointment.appointment_time
          );
          break;
        default:
          await sendThankYouMessage(
            appointment.patient_phone,
            appointment.patient_name,
            appointment.appointment_date,
            appointment.appointment_time
          );
      }

      // Mark reminder as sent
      const columnMap = {
        thank_you: 'thank_you_sent_at',
        '1day': 'reminder_1day_sent_at',
        '6h': 'reminder_6h_sent_at',
        '1h': 'reminder_1h_sent_at'
      };

      const column = columnMap[messageType];
      const db = getDb();
      db.prepare(`
        UPDATE appointments 
        SET ${column} = datetime('now'), updated_at = datetime('now') 
        WHERE id = ?
      `).run(id);

      sent = true;
      res.json({ success: true, message: `${messageType} reminder sent successfully` });
    } catch (whatsappError) {
      console.error('Manual reminder failed:', whatsappError.message);
      res.status(500).json({ error: `Failed to send reminder: ${whatsappError.message}` });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
