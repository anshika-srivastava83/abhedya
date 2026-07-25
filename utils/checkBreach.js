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

function hasWeakPattern(password) {
  const lower = password.toLowerCase();

  // "word + numbers" pattern, e.g. "password123", "admin2024"
  const wordPlusNumbers = /^[a-z]+\d{2,4}$/;

  // 3+ sequential ascending digits, e.g. "123", "456", "789"
  const sequentialDigits = /(?:012|123|234|345|456|567|678|789)/;

  // 3+ sequential ascending letters, e.g. "abc", "xyz"
  const sequentialLetters = /(?:abc|bcd|cde|def|efg|xyz|wxy)/;

  // keyboard row patterns
  const keyboardPatterns = /(?:qwerty|asdf|zxcv|qazwsx)/;

  return (
    wordPlusNumbers.test(lower) ||
    sequentialDigits.test(lower) ||
    sequentialLetters.test(lower) ||
    keyboardPatterns.test(lower)
  );
}

module.exports = { isCommonPassword, hasWeakPattern };