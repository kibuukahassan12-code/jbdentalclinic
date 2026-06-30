import 'dotenv/config';
import { runAllReminders } from './routes/reminders.js';
import cron from 'node-cron';
import { ensureAdmin } from './scripts/ensureAdmin.js';
import { createApp } from './app.js';

const PORT = process.env.PORT || 8000;
const app = createApp();

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
