const router = require("express").Router();
const fetch = require("node-fetch");

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${ML_URL}/`);
    const data = await response.json();

    res.json({
      backend: "OK",
      mlServiceResponse: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
