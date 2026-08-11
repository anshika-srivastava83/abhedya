const express = require("express");
const router = express.Router();
const db = require("../database/db");
const bcrypt = require("bcrypt");
const { isCommonPassword, hasWeakPattern } = require("../utils/checkBreach");
const { deriveKey, generateSalt } = require("../utils/encryptFile");

// NOTE: Password is hashed with bcrypt before storage
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  if (isCommonPassword(password)) {
    return res.status(400).json({ error: "This password appears in known breach lists. Please choose a different one." });
  }

  if(hasWeakPattern(password)) {
    return res.status(400).json({ error: "This password follows a predictable pattern. Please choose something less guessable." })
  }

  try {
    const salt = generateSalt();
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, salt);

    const encryptionKey = deriveKey(password, salt).toString("hex");
    res.json({ message: "Signup successful!", encryptionKey });
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

  const encryptionKey = deriveKey(password, user, salt).toString("hex");

  res.json({ message: `Welcome back, ${username}!`, encryptionKey });
});

router.get("/check-username/:username", (req, res) => {
  const { username } = req.params;
  const stmt = db.prepare("SELECT id FROM users WHERE username = ?");
  const user = stmt.get(username);
  res.json({ available: !user });
});

module.exports = router;