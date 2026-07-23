const express = require("express");
const router = express.Router();
const db = require("../database/db");

// NOTE: Password is stored as plain text here on purpose — this gets fixed in Phase 2 with hashing.
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, password);
    res.json({ message: "Signup successful!" });
  } catch (err) {
    res.status(400).json({ error: "That username is already taken." });
  }
});

module.exports = router;