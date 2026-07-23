const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

document.getElementById("showLogin").addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    document.getElementById("signupPrompt").style.display = "none";
    document.getElementById("loginPrompt").style.display = "inline";
    message.textContent = "";
});

document.getElementById("showSignup").addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    document.getElementById("loginPrompt").style.display = "none";
    document.getElementById("signupPrompt").style.display = "inline";
    message.textContent = "";
});

function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);

  input.addEventListener("input", () => {
    toggle.style.display = input.value.length === 0 ? "none" : "block";
    // Any time you type, force it back to hidden (crossed) — matches last project's behavior
    input.type = "password";
    toggle.textContent = "👁";
  });

  toggle.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      toggle.textContent = "🙈";
    } else {
      input.type = "password";
      toggle.textContent = "👁";
    }
  });
}

setupPasswordToggle("signupPassword", "toggleSignupPw");
setupPasswordToggle("loginPassword", "toggleLoginPw");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    const response = await fetch("/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password })
    });

    const data = await response.json();
    message.textContent = data.message || data.error();
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    message.textContent = data.message || data.error;
});

function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

document.getElementById("signupPassword").addEventListener("input", (e) => {
  const password = e.target.value;
  const strengthText = document.getElementById("passwordStrength");

  if (password.length === 0) {
    strengthText.textContent = "";
    return;
  }

  const score = checkPasswordStrength(password);
  const missing = [];
  if (password.length < 8) missing.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) missing.push("an uppercase letter");
  if (!/[0-9]/.test(password)) missing.push("a number");
  if (!/[^A-Za-z0-9]/.test(password)) missing.push("a symbol");

  if (score <= 2) {
    strengthText.textContent = `Weak — needs ${missing.join(", ")}`;
    strengthText.style.color = "#c0503a";
  } else if (score <= 4) {
    strengthText.textContent = "Moderate";
    strengthText.style.color = "#b58a3a";
  } else {
    strengthText.textContent = "Strong";
    strengthText.style.color = "#4a8b5c";
  }
});

let usernameTimeout;

document.getElementById("signupUsername").addEventListener("input", (e) => {
  const username = e.target.value.trim();
  const availabilityText = document.getElementById("usernameAvailability");

  clearTimeout(usernameTimeout);

  if (username.length === 0) {
    availabilityText.textContent = "";
    return;
  }

  // Wait 400ms after typing stops, so we're not firing a request on every single keystroke
  usernameTimeout = setTimeout(async () => {
    const response = await fetch(`/check-username/${username}`);
    const data = await response.json();

    if (data.available) {
      availabilityText.textContent = "✓ Username available";
      availabilityText.style.color = "#4a8b5c";
    } else {
      availabilityText.textContent = "✗ Username already taken";
      availabilityText.style.color = "#c0503a";
    }
  }, 400);
});