import { normalizeE164 } from '../lib/whatsapp.js';

const DATE_REG = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REG = /^\d{2}:\d{2}(:\d{2})?$/;

export function validateAppointmentBody(req, res, next) {
  const body = req.body || {};
  const { patient_name, patient_phone, appointment_date, appointment_time, service, notes } = body;
  const errs = [];
  if (!patient_name || typeof patient_name !== 'string' || patient_name.trim().length === 0) {
    errs.push('patient_name is required');
  }
  const phone = normalizeE164(patient_phone);
  if (!phone) {
    errs.push('patient_phone must be a valid number (e.g. 256752001269 or 0752001269)');
  }
  if (!DATE_REG.test(appointment_date)) {
    errs.push('appointment_date must be YYYY-MM-DD');
  }
  if (!TIME_REG.test(appointment_time)) {
    errs.push('appointment_time must be HH:MM or HH:MM:SS');
  }
  if (errs.length) {
    return res.status(400).json({ error: 'Validation failed', details: errs });
  }
  const VALID_STATUSES = ['Scheduled', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
  req.validated = {
    patient_name: patient_name.trim(),
    patient_phone: phone,
    appointment_date,
    appointment_time,
    duration_minutes: body.duration_minutes != null ? Number(body.duration_minutes) : 30,
    service: service ? String(service).trim() : null,
    notes: notes ? String(notes).trim() : null,
    patient_id: body.patient_id != null ? Number(body.patient_id) : undefined,
    dentist_id: body.dentist_id != null ? Number(body.dentist_id) : undefined,
    status: body.status && VALID_STATUSES.includes(body.status) ? body.status : 'Scheduled',
  };
  next();
}
