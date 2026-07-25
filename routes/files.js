const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.join(__dirname, "../uploads") });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file was uploaded." });
  }

  res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});

module.exports = router;