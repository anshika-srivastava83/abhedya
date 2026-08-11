const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../database/db");
const { encryptBuffer, decryptBuffer } = require("../utils/encryptFile");

const upload = multer({ dest: path.join(__dirname, "../uploads") });

router.post("/upload", upload.single("file"), (req, res) => {
  //console.log("Received encryptionKey:", req.body.encryptionKey);

  if (!req.file) {
    return res.status(400).json({ error: "No file was uploaded." });
  }

  const { owner, encryptionKey } = req.body;
  if (!owner || !encryptionKey) {
    return res.status(400).json({ error: "Missing owner or encryptionKey" });
  }

  const key = Buffer.from(encryptionKey, "hex");
  const filePath = path.join(__dirname, "../uploads", req.file.filename);
  const rawData = fs.readFileSync(filePath);
  const encryptedData = encryptBuffer(rawData, key);
  fs.writeFileSync(filePath, encryptedData);

  const stmt = db.prepare(
    "INSERT INTO files (filename, original_name, size, uploaded_at, owner) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(req.file.filename, req.file.originalname, req.file.size, new Date().toISOString(), owner);

  res.json({ message: "File uploaded" });
});

router.get("/files/:owner", (req, res) => {
  const stmt = db.prepare("SELECT * FROM files WHERE owner = ? ORDER BY uploaded_at DESC");
  const files = stmt.all(req.params.owner);
  res.json({ files });
});

router.get("/download/:id", (req, res) => {
  const { key: encryptionKey } = req.query;
  if(!encryptionKey) {
    return res.status(400).json({ error: "Missing encryption key." });
  }

  const stmt = db.prepare("SELECT * FROM files WHERE id = ?");
  const file = stmt.get(req.params.id);

  if (!file) {
    return res.status(404).json({ error: "File not found." });
  }

  const key = Buffer.from(encryptionKey, "hex");
  const filePath = path.join(__dirname, "../uploads", file.filename);
  const encryptedData = fs.readFileSync(filePath);

  try{
    const decryptedData = decryptBuffer(encryptedData, key);
  res.setHeader("Content-Disposition", `attachment; filename="${file.original_name}"`);
  res.send(decryptedData);
  }catch (err){
    res.status(403).json({ error: "Incorrect encryption key - cannot decrypt this file." });
  }
});

router.delete("/files/:id", (req, res) => {
  const stmt = db.prepare("SELECT * FROM files WHERE id = ?");
  const file = stmt.get(req.params.id);

  if (!file) {
    return res.status(404).json({ error: "File not found." });
  }

  fs.unlinkSync(path.join(__dirname, "../uploads", file.filename));
  db.prepare("DELETE FROM files WHERE id = ?").run(req.params.id);
  res.json({ message: "File deleted" });
});

module.exports = router;