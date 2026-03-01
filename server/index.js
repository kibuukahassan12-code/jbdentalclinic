import express from 'express';
import cors from 'cors';
import appointmentsRouter from './routes/appointments.js';
import patientsRouter from './routes/patients.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`JB Dental API server running on port ${PORT}`);
});
