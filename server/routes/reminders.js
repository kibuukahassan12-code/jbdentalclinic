import { Router } from 'express';
import { getDb } from '../db.js';
import {
  sendThankYouMessage,
  send1DayReminder,
  send6HourReminder,
  send1HourReminder,
} from '../lib/whatsapp.js';
import {
  sendEmail,
  buildThankYouEmail,
  build1DayEmail,
  build6HourEmail,
  build1HourEmail,
} from '../lib/email.js';

const router = Router();

/**
 * Mark which type of reminder was sent
 */
function markReminderSent(appointmentId, reminderType) {
  const db = getDb();
  const column = {
    thank_you: 'thank_you_sent_at',
    '1day': 'reminder_1day_sent_at',
    '6h': 'reminder_6h_sent_at',
    '1h': 'reminder_1h_sent_at',
  }[reminderType];

  if (!column) throw new Error('Invalid reminder type');

  const stmt = db.prepare(`
    UPDATE appointments 
    SET ${column} = datetime('now'), updated_at = datetime('now') 
    WHERE id = ?
  `);
  return stmt.run(appointmentId);
}

function markEmailReminderSent(appointmentId, reminderType) {
  const db = getDb();
  const column = {
    thank_you: 'thank_you_email_sent_at',
    '1day': 'reminder_1day_email_sent_at',
    '6h': 'reminder_6h_email_sent_at',
    '1h': 'reminder_1h_email_sent_at',
  }[reminderType];

  if (!column) throw new Error('Invalid reminder type');

  const stmt = db.prepare(`
    UPDATE appointments 
    SET ${column} = datetime('now'), updated_at = datetime('now') 
    WHERE id = ?
  `);
  return stmt.run(appointmentId);
}

function getAppointmentEmail(apt) {
  const db = getDb();
  const pid = apt.patient_id != null ? Number(apt.patient_id) : null;
  const phone = apt.patient_phone ? String(apt.patient_phone) : null;

  if (pid) {
    const row = db.prepare('SELECT email FROM patients WHERE id = ?').get(pid);
    if (row?.email) return String(row.email).trim();
  }

  if (phone) {
    const row = db.prepare('SELECT email FROM patients WHERE phone = ? LIMIT 1').get(phone);
    if (row?.email) return String(row.email).trim();
  }

  return null;
}

/**
 * Send thank you message for newly created appointments
 * With retry logic for failed messages
 */
export async function sendThankYouMessages() {
  const db = getDb();
  // Get appointments created within last hour that haven't received thank you message
  // Also retry appointments where thank you failed (created within last 24 hours)
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE (thank_you_sent_at IS NULL OR thank_you_sent_at = '')
      AND datetime(created_at) >= datetime('now', '-24 hours')
      AND status != 'Cancelled'
    ORDER BY created_at ASC
    LIMIT 50
  `);
  const appointments = stmt.all();

  const results = { sent: 0, failed: [], retried: 0 };
  for (const apt of appointments) {
    try {
      await sendThankYouMessage(
        apt.patient_phone,
        apt.patient_name,
        apt.appointment_date,
        apt.appointment_time
      );
      markReminderSent(apt.id, 'thank_you');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: 'thank_you', error: e.message, patient: apt.patient_name });
    }
  }
  return results;
}

export async function send6HourEmailReminders() {
  const db = getDb();
  const now = new Date();
  const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  const targetDate = in6Hours.toISOString().slice(0, 10);

  const timeFrom = new Date(in6Hours.getTime() - 30 * 60 * 1000).toTimeString().slice(0, 5);
  const timeTo = new Date(in6Hours.getTime() + 30 * 60 * 1000).toTimeString().slice(0, 5);

  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ?
      AND appointment_time BETWEEN ? AND ?
      AND (reminder_6h_email_sent_at IS NULL OR reminder_6h_email_sent_at = '')
      AND status != 'Cancelled'
    ORDER BY appointment_time ASC
    LIMIT 50
  `);
  const appointments = stmt.all(targetDate, timeFrom, timeTo);

  const results = { sent: 0, skipped: 0, failed: [] };
  for (const apt of appointments) {
    const to = getAppointmentEmail(apt);
    if (!to) {
      results.skipped += 1;
      continue;
    }
    try {
      const { subject, text, html } = build6HourEmail({
        patientName: apt.patient_name,
        date: apt.appointment_date,
        time: apt.appointment_time,
      });
      await sendEmail({ to, subject, text, html });
      markEmailReminderSent(apt.id, '6h');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: '6h', error: e.message, email: to });
    }
  }
  return results;
}

export async function send1DayEmailReminders() {
  const db = getDb();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ?
      AND (reminder_1day_email_sent_at IS NULL OR reminder_1day_email_sent_at = '')
      AND status != 'Cancelled'
    ORDER BY appointment_time ASC
    LIMIT 50
  `);
  const appointments = stmt.all(tomorrowStr);

  const results = { sent: 0, skipped: 0, failed: [] };
  for (const apt of appointments) {
    const to = getAppointmentEmail(apt);
    if (!to) {
      results.skipped += 1;
      continue;
    }
    try {
      const { subject, text, html } = build1DayEmail({
        patientName: apt.patient_name,
        date: apt.appointment_date,
        time: apt.appointment_time,
      });
      await sendEmail({ to, subject, text, html });
      markEmailReminderSent(apt.id, '1day');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: '1day', error: e.message, email: to });
    }
  }
  return results;
}

export async function sendThankYouEmails() {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE (thank_you_email_sent_at IS NULL OR thank_you_email_sent_at = '')
      AND datetime(created_at) >= datetime('now', '-24 hours')
      AND status != 'Cancelled'
    ORDER BY created_at ASC
    LIMIT 50
  `);
  const appointments = stmt.all();

  const results = { sent: 0, skipped: 0, failed: [] };
  for (const apt of appointments) {
    const to = getAppointmentEmail(apt);
    if (!to) {
      results.skipped += 1;
      continue;
    }
    try {
      const { subject, text, html } = buildThankYouEmail({
        patientName: apt.patient_name,
        date: apt.appointment_date,
        time: apt.appointment_time,
      });
      await sendEmail({ to, subject, text, html });
      markEmailReminderSent(apt.id, 'thank_you');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: 'thank_you', error: e.message, email: to });
    }
  }
  return results;
}

/**
 * Send 1-day before reminders
 * With retry logic for failed messages
 */
export async function send1DayReminders() {
  const db = getDb();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Get appointments for tomorrow that haven't received 1-day reminder, plus retry failed
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ?
      AND (reminder_1day_sent_at IS NULL OR reminder_1day_sent_at = '')
      AND status != 'Cancelled'
    ORDER BY appointment_time ASC
    LIMIT 50
  `);
  const appointments = stmt.all(tomorrowStr);

  const results = { sent: 0, failed: [] };
  for (const apt of appointments) {
    try {
      await send1DayReminder(
        apt.patient_phone,
        apt.patient_name,
        apt.appointment_date,
        apt.appointment_time
      );
      markReminderSent(apt.id, '1day');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: '1day', error: e.message });
    }
  }
  return results;
}

/**
 * Send 6-hour before reminders
 * With retry logic for failed messages
 */
export async function send6HourReminders() {
  const db = getDb();
  const now = new Date();
  const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  // Get date and time range
  const targetDate = in6Hours.toISOString().slice(0, 10);
  const targetTime = in6Hours.toTimeString().slice(0, 5); // HH:MM format

  // Get appointments that are approximately 6 hours from now (±30 minutes window)
  const timeFrom = new Date(in6Hours.getTime() - 30 * 60 * 1000).toTimeString().slice(0, 5);
  const timeTo = new Date(in6Hours.getTime() + 30 * 60 * 1000).toTimeString().slice(0, 5);

  // Include retry for failed reminders
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ?
      AND appointment_time BETWEEN ? AND ?
      AND (reminder_6h_sent_at IS NULL OR reminder_6h_sent_at = '')
      AND status != 'Cancelled'
    ORDER BY appointment_time ASC
    LIMIT 50
  `);
  const appointments = stmt.all(targetDate, timeFrom, timeTo);

  const results = { sent: 0, failed: [] };
  for (const apt of appointments) {
    try {
      await send6HourReminder(
        apt.patient_phone,
        apt.patient_name,
        apt.appointment_date,
        apt.appointment_time
      );
      markReminderSent(apt.id, '6h');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: '6h', error: e.message });
    }
  }
  return results;
}

/**
 * Send 1-hour before reminders
 * With retry logic for failed messages
 */
export async function send1HourReminders() {
  const db = getDb();
  const now = new Date();
  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

  // Get date and time range
  const targetDate = in1Hour.toISOString().slice(0, 10);

  // Get appointments that are approximately 1 hour from now (±15 minutes window)
  const timeFrom = new Date(in1Hour.getTime() - 15 * 60 * 1000).toTimeString().slice(0, 5);
  const timeTo = new Date(in1Hour.getTime() + 15 * 60 * 1000).toTimeString().slice(0, 5);

  // Include retry for failed reminders
  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ?
      AND appointment_time BETWEEN ? AND ?
      AND (reminder_1h_sent_at IS NULL OR reminder_1h_sent_at = '')
      AND status != 'Cancelled'
    ORDER BY appointment_time ASC
    LIMIT 50
  `);
  const appointments = stmt.all(targetDate, timeFrom, timeTo);

  const results = { sent: 0, failed: [] };
  for (const apt of appointments) {
    try {
      await send1HourReminder(
        apt.patient_phone,
        apt.patient_name,
        apt.appointment_date,
        apt.appointment_time
      );
      markReminderSent(apt.id, '1h');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: '1h', error: e.message });
    }
  }
  return results;
}

export async function send1HourEmailReminders() {
  const db = getDb();
  const now = new Date();
  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

  const targetDate = in1Hour.toISOString().slice(0, 10);

  const timeFrom = new Date(in1Hour.getTime() - 15 * 60 * 1000).toTimeString().slice(0, 5);
  const timeTo = new Date(in1Hour.getTime() + 15 * 60 * 1000).toTimeString().slice(0, 5);

  const stmt = db.prepare(`
    SELECT * FROM appointments
    WHERE appointment_date = ?
      AND appointment_time BETWEEN ? AND ?
      AND (reminder_1h_email_sent_at IS NULL OR reminder_1h_email_sent_at = '')
      AND status != 'Cancelled'
    ORDER BY appointment_time ASC
    LIMIT 50
  `);
  const appointments = stmt.all(targetDate, timeFrom, timeTo);

  const results = { sent: 0, skipped: 0, failed: [] };
  for (const apt of appointments) {
    const to = getAppointmentEmail(apt);
    if (!to) {
      results.skipped += 1;
      continue;
    }
    try {
      const { subject, text, html } = build1HourEmail({
        patientName: apt.patient_name,
        date: apt.appointment_date,
        time: apt.appointment_time,
      });
      await sendEmail({ to, subject, text, html });
      markEmailReminderSent(apt.id, '1h');
      results.sent += 1;
    } catch (e) {
      results.failed.push({ id: apt.id, type: '1h', error: e.message, email: to });
    }
  }
  return results;
}

/**
 * Run all reminder checks
 */
export async function runAllReminders() {
  const thankYou = await sendThankYouMessages();
  const thankYouEmail = await sendThankYouEmails();
  const day1 = await send1DayReminders();
  const day1Email = await send1DayEmailReminders();
  const hour6 = await send6HourReminders();
  const hour6Email = await send6HourEmailReminders();
  const hour1 = await send1HourReminders();
  const hour1Email = await send1HourEmailReminders();

  return {
    thank_you: thankYou,
    thank_you_email: thankYouEmail,
    reminder_1day: day1,
    reminder_1day_email: day1Email,
    reminder_6h: hour6,
    reminder_6h_email: hour6Email,
    reminder_1h: hour1,
    reminder_1h_email: hour1Email,
    total_sent: thankYou.sent + day1.sent + hour6.sent + hour1.sent,
    total_email_sent: (thankYouEmail.sent || 0) + (day1Email.sent || 0) + (hour6Email.sent || 0) + (hour1Email.sent || 0),
    total_failed:
      (thankYou.failed?.length || 0) +
      (day1.failed?.length || 0) +
      (hour6.failed?.length || 0) +
      (hour1.failed?.length || 0),
    total_email_failed:
      (thankYouEmail.failed?.length || 0) +
      (day1Email.failed?.length || 0) +
      (hour6Email.failed?.length || 0) +
      (hour1Email.failed?.length || 0),
  };
}

// API Routes
router.post('/', async (req, res) => {
  try {
    const results = await runAllReminders();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Individual reminder type endpoints
router.post('/thank-you', async (req, res) => {
  try {
    const results = await sendThankYouMessages();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/1day', async (req, res) => {
  try {
    const results = await send1DayReminders();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/6h', async (req, res) => {
  try {
    const results = await send6HourReminders();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/1h', async (req, res) => {
  try {
    const results = await send1HourReminders();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
