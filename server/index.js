import express from 'express';
import cors from 'cors';
import nodePath from 'path';
import { fileURLToPath } from 'url';
import appointmentsRouter from './routes/appointments.js';
import patientsRouter from './routes/patients.js';

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));
const distPath = nodePath.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(nodePath.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`JB Dental API server running on port ${PORT}`);
});
