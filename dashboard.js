const tier = localStorage.getItem("checkreel_tier") || "free";

// Global supported formats across all plans
const supportedFormats = ['.mp4', '.jpg', '.jpeg', '.png', '.mp3', '.wav', '.mov', '.webm', '.gif', '.aac', '.opus'];

const limits = {
  free: { scans: 3, size: 10, formats: supportedFormats },
  premium: { scans: 20, size: 10, formats: supportedFormats },
  plus: { scans: 40, size: 50, formats: supportedFormats }
};

let scanCount = parseInt(localStorage.getItem("checkreel_scan_count")) || 0;

function resetIfNewMonth() {
  const now = new Date();
  const lastReset = new Date(localStorage.getItem("checkreel_last_reset") || 0);

  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    localStorage.setItem("checkreel_scan_count", "0");
    localStorage.setItem("checkreel_last_reset", now.toISOString());
    localStorage.removeItem("checkreel_history");
    scanCount = 0;
    alert("🔄 Scan quota refreshed for the new month.");
  }
}

function updateScanCounter() {
  document.getElementById("scan-counter").textContent = `Scans used: ${scanCount} / ${limits[tier].scans}`;
}

function isValidFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const sizeOK = file.size <= limits[tier].size * 1024 * 1024;
  const formatOK = supportedFormats.includes(ext);

  if (!sizeOK) return alert(`⚠️ Max ${limits[tier].size}MB allowed.`), false;
  if (!formatOK) return alert(`⚠️ Format ${ext} not allowed.`), false;

  return true;
}

function getSelectedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input:checked`)].map(cb => cb.value);
}

function saveHistoryEntry(entry) {
  if (tier !== "plus") return;
  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
  history.push(entry);
  localStorage.setItem("checkreel_history", JSON.stringify(history));
}

function deleteHistoryEntry(index) {
  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
  history.splice(index, 1);
  localStorage.setItem("checkreel_history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("history-list");
  const count = document.getElementById("history-count");
  const jsonBtn = document.getElementById("export-history-json");
  const txtBtn = document.getElementById("export-history-txt");

  list.innerHTML = "";
  count.textContent = "";
  jsonBtn.style.display = "none";
  txtBtn.style.display = "none";

  if (tier !== "plus") return;

  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
  const sort = document.getElementById("sort-history").value;
  const sorted = [...history].sort((a, b) =>
    sort === "newest" ? new Date(b.timestamp) - new Date(a.timestamp) : new Date(a.timestamp) - new Date(b.timestamp)
  );

  count.textContent = `🧾 Total saved scans: ${sorted.length}`;

  sorted.forEach((item, index) => {
    const li = document.createElement("li");
    const platforms = item.platforms.map(p => `<span class="badge">${p}</span>`).join(' ');
    li.innerHTML = `
      <div><strong>${item.filename}</strong> — ${item.timestamp}</div>
      <div>Platforms: ${platforms} | Regions: ${item.regions.join(', ')}</div>
      <div class="feedback">🧠 ${item.feedback}</div>
      <button class="delete-btn" data-index="${index}">🗑️</button>
    `;
    list.appendChild(li);
  });

  if (sorted.length > 0) {
    jsonBtn.style.display = "inline-block";
    txtBtn.style.display = "inline-block";
  }

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteHistoryEntry(parseInt(btn.dataset.index)));
  });
}

document.getElementById("submit-button").addEventListener("click", () => {
  const file = document.getElementById("content-upload").files[0];
  if (!file) return alert("Please select a file.");
  if (!isValidFile(file)) return;
  if (scanCount >= limits[tier].scans) return alert("⚠️ Scan limit reached.");

  scanCount += 1;
  localStorage.setItem("checkreel_scan_count", scanCount);
  updateScanCounter();

  const platforms = getSelectedValues("platform-options");
  const regions = getSelectedValues("region-options");
  const feedback = "✅ Analysis complete. Content meets platform guidelines.";

  if (tier === "plus") {
    saveHistoryEntry({
      filename: file.name,
      timestamp: new Date().toLocaleString(),
      platforms,
      regions,
      feedback
    });
    renderHistory();
  }

  document.getElementById("result-section").style.display = "block";
  document.getElementById("ai-feedback").textContent = "Analyzing...";

  setTimeout(() => {
    document.getElementById("ai-feedback").textContent = feedback;
  }, 1500);
});

document.getElementById("sort-history").addEventListener("change", renderHistory);

document.getElementById("export-history-json").addEventListener("click", () => {
  const data = localStorage.getItem("checkreel_history");
  if (!data) return;
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, "checkreel_history.json");
});

document.getElementById("export-history-txt").addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
  const lines = history.map((h, i) =>
    `${i + 1}. ${h.timestamp} — ${h.filename}\n   Platforms: ${h.platforms.join(', ')}\n   Regions: ${h.regions.join(', ')}\n   Feedback: ${h.feedback}\n`
  ).join('\n');
  const blob = new Blob([lines], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, "checkreel_history.txt");
});

function downloadBlob(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  resetIfNewMonth();
  document.getElementById("plan-tier").textContent = tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";
  updateScanCounter();
  renderHistory();
});
