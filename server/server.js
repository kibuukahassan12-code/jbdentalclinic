const express = require("express");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

const app = express();

app.use(express.json());

/* ---------------- API ROUTES ---------------- */

// Admin login endpoint
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jbdentalclinic.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@Admin123#';
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    res.json({
      success: true,
      token: token,
      apiKey: token,
      message: "Login successful"
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Invalid email or password"
    });
  }
});

// Dashboard endpoint - mock data
app.get("/api/reports/dashboard", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);
  
  res.json({
    today_appointments_count: 0,
    today_appointments: [],
    total_patients: 0,
    pending_invoices_count: 0,
    low_stock_count: 0,
    low_stock_items: [],
    recent_treatments: [],
    daily_revenue: 0,
    monthly_revenue: 0,
    total_outstanding: 0,
    outstanding_balances: [],
    as_of: today,
    month: thisMonth
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api", (req, res) => {
  res.json({
    message: "JB Dental Clinic API running"
  });
});

/* ---------------- CRON JOB (REMINDERS) ---------------- */

function runReminderChecks() {
  console.log("Running reminder checks...");
  // your reminder logic runs here
}

const reminderJob = cron.schedule("* * * * *", () => {
  runReminderChecks();
});

/* ---------------- FRONTEND ---------------- */

const distPath = path.join(__dirname, "..", "dist");
const indexPath = path.join(distPath, "index.html");

console.log("Checking frontend build at:", distPath);

if (fs.existsSync(indexPath)) {

  console.log("Frontend detected. Serving React app.");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });

} else {

  console.log("Frontend build not found.");

  app.get("/", (req, res) => {
    res.send(`
      <h1>JB Dental Clinic System</h1>
      <p>Backend API is running successfully.</p>
      <p>Frontend build not found.</p>
    `);
  });

}

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`JB Dental Clinic running on port ${PORT}`);
});

/* ---------------- GRACEFUL SHUTDOWN ---------------- */

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");

  reminderJob.stop();

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});