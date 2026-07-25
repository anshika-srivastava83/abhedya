document.getElementById("vaultUsername").textContent = localStorage.getItem("username") || "friend";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const uploadMessage = document.getElementById("uploadMessage");

  if (!fileInput.files.length) {
    uploadMessage.textContent = "❌ Please choose a file first.";
    uploadMessage.style.color = "#c0503a";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (response.ok) {
    uploadMessage.textContent = "✅ " + data.message;
    uploadMessage.style.color = "#4a8b5c";
  } else {
    uploadMessage.textContent = "❌ " + data.error;
    uploadMessage.style.color = "#c0503a";
  }
});