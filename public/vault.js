const username = localStorage.getItem("username");

if (!username) {
  window.location.href = "index.html";
}

document.getElementById("vaultUsername").textContent = username;

document.getElementById("logoutBtn").addEventListener("click", () => {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    localStorage.removeItem("username");
    window.location.href = "index.html";
  }, 300);
});

const iconMap = {
  pdf: "ti-file-text",
  png: "ti-photo", jpg: "ti-photo", jpeg: "ti-photo", gif: "ti-photo",
  xlsx: "ti-file-spreadsheet", csv: "ti-file-spreadsheet",
  doc: "ti-file-text", docx: "ti-file-text",
  zip: "ti-file-zip", rar: "ti-file-zip"
};

function getIcon(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return iconMap[ext] || "ti-file";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

async function loadFiles() {
  const response = await fetch(`/files/${username}`);
  const data = await response.json();
  const listEl = document.getElementById("fileList");

  if (data.files.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <p>No files yet</p>
        <p class="empty-subtext">Upload your first file to get started.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = data.files.map(file => `
    <div class="file-row" data-id="${file.id}">
      <div class="file-icon"><i class="ti ${getIcon(file.original_name)}"></i></div>
      <div class="file-info">
        <p class="file-name">${file.original_name}</p>
        <p class="file-meta">${formatSize(file.size)} · uploaded ${formatDate(file.uploaded_at)}</p>
      </div>
      <a href="/download/${file.id}" class="download-btn"><i class="ti ti-download"></i></a>
      <button class="delete-btn" data-id="${file.id}"><i class="ti ti-trash"></i></button>
    </div>
  `).join("");

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const confirmed = confirm("Delete this file permanently? This can't be undone.");
      if (!confirmed) return;

      await fetch(`/files/${btn.dataset.id}`, { method: "DELETE" });
      loadFiles();
    });
  });
}

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
  formData.append("owner", username);

  const response = await fetch("/upload", { method: "POST", body: formData });
  const data = await response.json();

  if (response.ok) {
    uploadMessage.textContent = "✅ " + data.message;
    uploadMessage.style.color = "#4a8b5c";
    fileInput.value = "";
    loadFiles();
  } else {
    uploadMessage.textContent = "❌ " + data.error;
    uploadMessage.style.color = "#c0503a";
  }
});

loadFiles();