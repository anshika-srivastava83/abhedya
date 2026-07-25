const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");

// NOTE: Password is stored as plain text here on purpose — this gets fixed in Phase 2 with hashing.
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword);
    res.json({ message: "Signup successful!" });
  } catch (err) {
    res.status(400).json({ error: "That username is already taken." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  const user = stmt.get(username);

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if(!passwordMatches) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  res.json({ message: `Welcome back, ${username}!` });
});

router.get("/check-username/:username", (req, res) => {
  const { username } = req.params;
  const stmt = db.prepare("SELECT id FROM users WHERE username = ?");
  const user = stmt.get(username);
  res.json({ available: !user });
});

module.exports = router;