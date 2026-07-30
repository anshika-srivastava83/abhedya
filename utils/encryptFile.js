const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const KEY = crypto.scryptSync("abhedya-secret-key", "salt", 32);

function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

function decryptBuffer(buffer) {
  const iv = buffer.subarray(0, 16);
  const encrypted = buffer.subarray(16);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

module.exports = { encryptBuffer, decryptBuffer };