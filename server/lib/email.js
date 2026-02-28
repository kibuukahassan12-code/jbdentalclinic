import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';

  if (!host || !port || !user || !pass) {
    throw new Error('Email (SMTP) credentials not configured');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error('EMAIL_FROM not configured');
  }

  const t = getTransporter();

  const info = await t.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}

export function buildThankYouEmail({ patientName, date, time }) {
  const subject = 'Thank you for booking - JB Dental Clinic';
  const text = `Thank you for choosing JB Dental Clinic.\n\nDear ${patientName},\n\nYour Appointment Details:\nDate: ${date}\nTime: ${time}\n\nMakindye, Kampala\nPhone: 0752001269`;
  const html = `<p>Dear ${escapeHtml(patientName)},</p><p>Thank you for choosing <strong>JB Dental Clinic</strong>.</p><p><strong>Your Appointment Details:</strong><br/>Date: ${escapeHtml(date)}<br/>Time: ${escapeHtml(time)}</p><p>Makindye, Kampala<br/>Phone: 0752001269</p>`;
  return { subject, text, html };
}

export function build1DayEmail({ patientName, date, time }) {
  const subject = 'Appointment reminder (tomorrow) - JB Dental Clinic';
  const text = `Appointment Reminder - JB Dental Clinic\n\nDear ${patientName},\n\nThis is a reminder that you have an appointment with us tomorrow.\n\nDate: ${date}\nTime: ${time}\n\nPlease arrive 10 minutes early.\nMakindye, Kampala\nPhone: 0752001269`;
  const html = `<p>Dear ${escapeHtml(patientName)},</p><p>This is a reminder that you have an appointment with us <strong>tomorrow</strong>.</p><p><strong>Appointment Details:</strong><br/>Date: ${escapeHtml(date)}<br/>Time: ${escapeHtml(time)}</p><p>Please arrive 10 minutes early.</p><p>Makindye, Kampala<br/>Phone: 0752001269</p>`;
  return { subject, text, html };
}

export function build6HourEmail({ patientName, date, time }) {
  const subject = 'Appointment in ~6 hours - JB Dental Clinic';
  const text = `Appointment in 6 Hours - JB Dental Clinic\n\nDear ${patientName},\n\nYour appointment is coming up in approximately 6 hours.\n\nDate: ${date}\nTime: ${time}\n\nMakindye, Kampala\nPhone: 0752001269`;
  const html = `<p>Dear ${escapeHtml(patientName)},</p><p>Your appointment is coming up in approximately <strong>6 hours</strong>.</p><p><strong>Appointment Details:</strong><br/>Date: ${escapeHtml(date)}<br/>Time: ${escapeHtml(time)}</p><p>Makindye, Kampala<br/>Phone: 0752001269</p>`;
  return { subject, text, html };
}

export function build1HourEmail({ patientName, date, time }) {
  const subject = 'Final reminder: appointment in 1 hour - JB Dental Clinic';
  const text = `Final Reminder - JB Dental Clinic\n\nDear ${patientName},\n\nYour appointment is in 1 hour.\n\nDate: ${date}\nTime: ${time}\n\nMakindye, Kampala\nPhone: 0752001269`;
  const html = `<p>Dear ${escapeHtml(patientName)},</p><p>Your appointment is in <strong>1 hour</strong>.</p><p><strong>Appointment Details:</strong><br/>Date: ${escapeHtml(date)}<br/>Time: ${escapeHtml(time)}</p><p>Makindye, Kampala<br/>Phone: 0752001269</p>`;
  return { subject, text, html };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
