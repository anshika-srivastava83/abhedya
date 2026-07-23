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