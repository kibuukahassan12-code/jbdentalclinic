const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* ---------------- API ROUTES ---------------- */

app.get("/api", (req, res) => {
  res.json({
    message: "JB Dental Clinic API is running"
  });
});

/* ---------------- FRONTEND ---------------- */

// Correct path to dist folder
const distPath = path.join(__dirname, "..", "dist");

// Serve static files
app.use(express.static(distPath));

// React router support
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`JB Dental Clinic running on port ${PORT}`);
});