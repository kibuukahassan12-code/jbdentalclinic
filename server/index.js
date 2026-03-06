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
import settings from './routes/settings.js';
import communicationLogs from './routes/communication-logs.js';
import users from './routes/users.js';
import auditLogs from './routes/audit-logs.js';
import search from './routes/search.js';
import cron from 'node-cron';
import { ensureAdmin } from './scripts/ensureAdmin.js';

initDb();

const app = express();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/settings', requireApiKey, settings);
app.use('/api/communication-logs', requireApiKey, communicationLogs);
app.use('/api/users', requireApiKey, users);
app.use('/api/audit-logs', requireApiKey, auditLogs);
app.use('/api/search', requireApiKey, search);
app.use('/api/admin', loginLimiter, adminAuth);
app.use('/api/seed', requireApiKey, seed);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Universal frontend serving - detects build folder automatically
let frontendPath = null;
const possiblePaths = ['dist', 'public', 'client/build', 'build'];
for (const p of possiblePaths) {
  const full = path.resolve(__dirname, '..', p);
  if (!frontendPath && fs.existsSync(full)) {
    frontendPath = full;
    console.log(`Frontend detected at: ${p}`);
  }
}

if (frontendPath) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send('JB Dental Clinic API running');
  });
}

function startReminderService() {
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
}

try {
  await ensureAdmin();
} catch (e) {
  console.error('Admin seed error:', e);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`JB Dental API server running on port ${PORT}`);

  setTimeout(() => {
    startReminderService();
  }, 5000);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  process.exit(0);
});
