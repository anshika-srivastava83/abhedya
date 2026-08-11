const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";

function deriveKey(password, salt) {
  return crypto.scryptSync(password, salt, 32);
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function encryptBuffer(buffer, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

function decryptBuffer(buffer, key) {
  const iv = buffer.subarray(0, 16);
  const encrypted = buffer.subarray(16);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

module.exports = { deriveKey, generateSalt, encryptBuffer, decryptBuffer };