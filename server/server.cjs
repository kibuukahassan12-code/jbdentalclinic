const express = require("express");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

const app = express();

app.use(express.json());

/* ---------------- API ROUTES ---------------- */

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