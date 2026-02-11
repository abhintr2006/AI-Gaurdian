require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────
app.use("/api/upload", require("./routes/upload"));
app.use("/api/test", require("./routes/test"));
app.use("/api/ml-test", require("./routes/mlTest"));

// ── Health check ───────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ───────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received – shutting down…");
  server.close(() => process.exit(0));
});
