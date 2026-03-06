const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* API ROUTES */
app.get("/api", (req, res) => {
  res.json({ message: "JB Dental Clinic API running" });
});

/* SERVE FRONTEND */
app.use(express.static(path.join(__dirname, "dist")));

/* SPA ROUTING */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* START SERVER */
app.listen(PORT, () => {
  console.log(`JB Dental Clinic running on port ${PORT}`);
});