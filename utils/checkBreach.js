const fs = require("fs");
const path = require("path");

const commonPasswords = new Set(
  fs.readFileSync(path.join(__dirname, "../data/common_passwords.txt"), "utf-8")
    .split("\n")
    .map(line => line.trim().toLowerCase())
);

function isCommonPassword(password) {
  return commonPasswords.has(password.toLowerCase());
}

module.exports = { isCommonPassword };