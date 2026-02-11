const express = require("express");
const router = express.Router();
const multer = require("multer");
const fetch = require("node-fetch");

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

// memory storage (no disk)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // send image bytes to ML service
    const mlResponse = await fetch(`${ML_URL}/analyze`, {
      method: "POST",
      body: req.file.buffer,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!mlResponse.ok) {
      const text = await mlResponse.text();
      return res
        .status(502)
        .json({ error: "ML service error", details: text });
    }

    const mlData = await mlResponse.json();
    return res.json({ success: true, mlData });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
