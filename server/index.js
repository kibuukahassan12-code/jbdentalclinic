import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from './db.js';
import { requireApiKey } from './middleware/auth.js';
import { loginLimiter, apiLimiter } from './middleware/rate-limit.js';
import appointments from './routes/appointments.js';
import reminders from './routes/reminders.js';
import { runAllReminders } from './routes/reminders.js';
import patients from './routes/patients.js';
import staff from './routes/staff.js';
import treatments from './routes/treatments.js';
import treatmentPlans from './routes/treatment-plans.js';
import dentalChart from './routes/dental-chart.js';
import invoices from './routes/invoices.js';
import payments from './routes/payments.js';
import inventory from './routes/inventory.js';
import reports from './routes/reports.js';
import patientReports from './routes/patient-reports.js';
import adminAuth from './routes/admin-auth.js';
import seed from './routes/seed.js';
import cron from 'node-cron';

initDb();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: isProd ? process.env.CORS_ORIGIN || undefined : true,
    credentials: true,
  })
);

// General rate limit on all API routes
app.use('/api', apiLimiter);

app.use('/api/appointments', requireApiKey, appointments);
app.use('/api/send-reminders', requireApiKey, reminders);
app.use('/api/patients', requireApiKey, patients);
app.use('/api/staff', requireApiKey, staff);
app.use('/api/treatments', requireApiKey, treatments);
app.use('/api/treatment-plans', requireApiKey, treatmentPlans);
app.use('/api/dental-chart', requireApiKey, dentalChart);
app.use('/api/invoices', requireApiKey, invoices);
app.use('/api/payments', requireApiKey, payments);
app.use('/api/inventory', requireApiKey, inventory);
app.use('/api/reports', requireApiKey, reports);
app.use('/api/patient-reports', requireApiKey, patientReports);
app.use('/api/admin', loginLimiter, adminAuth);
app.use('/api/seed', requireApiKey, seed);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

if (isProd || fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Run reminder checks every 30 minutes for timely delivery
// This includes: thank you messages, 1-day, 6-hour, and 1-hour reminders
const cronSchedule = process.env.REMINDER_CRON || '*/30 * * * *';
cron.schedule(cronSchedule, async () => {
  try {
    console.log('Running reminder checks...');
    const results = await runAllReminders();
    console.log('Reminders sent:', results);
  } catch (e) {
    console.error('Reminder cron error:', e);
  }
}, { timezone: process.env.TZ || 'Africa/Kampala' });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
