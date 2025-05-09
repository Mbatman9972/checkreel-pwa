// dashboard.js

const tier = localStorage.getItem("checkreel_tier") || "free";

const supportedFormats = ['.mp4', '.jpg', '.jpeg', '.png', '.mp3', '.wav', '.mov', '.webm', '.gif', '.aac'];

const limits = {
  free: { scans: 3, size: 10, formats: supportedFormats },
  premium: { scans: 20, size: 10, formats: supportedFormats },
  plus: { scans: 40, size: 50, formats: supportedFormats }
};

let scanCount = parseInt(localStorage.getItem("checkreel_scan_count")) || 0;

function resetIfNewMonth() {
  const now = new Date();
  const lastReset = new Date(localStorage.getItem("checkreel_last_reset") || 0);
  const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

  if (isNewMonth) {
    localStorage.setItem("checkreel_scan_count", 0);
    localStorage.setItem("checkreel_last_reset", now.toISOString());
    localStorage.removeItem("checkreel_history");
    scanCount = 0;
    alert("🔄 Your scan quota has been refreshed for this month.");
  }
}

function updateScanCounter() {
  const counter = document.getElementById("scan-counter");
  counter.textContent = `Scans used: ${scanCount} / ${limits[tier].scans}`;
}

function isValidFile(file) {
  const maxMB = limits[tier].size;
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const sizeOK = file.size <= maxMB * 1024 * 1024;
  const formatOK = supportedFormats.includes(ext);

  if (!sizeOK) {
    alert(`⚠️ Your file exceeds the ${maxMB}MB limit for the ${tier} plan.`);
    return false;
  }
  if (!formatOK) {
    alert(`⚠️ Format “${ext}” is not supported.\nAccepted formats: ${supportedFormats.join(', ')}`);
    return false;
  }
  return true;
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
  count.innerText = "";
  jsonBtn.style.display = "none";
  txtBtn.style.display = "none";

  if (tier !== "plus") return;

  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");

  count.textContent = `🧾 Total saved scans: ${history.length}`;

  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.timestamp} — <strong>${item.filename}</strong> 
      [${item.platforms.join(', ')}] | ${item.regions.join(', ')} 
      <button class="delete-btn" data-index="${index}">🗑️</button>
    `;
    list.appendChild(li);
  });

  jsonBtn.style.display = history.length ? "inline-block" : "none";
  txtBtn.style.display = history.length ? "inline-block" : "none";

  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      const index = parseInt(e.target.dataset.index);
      deleteHistoryEntry(index);
    })
  );
}

function getSelectedValues(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`))
    .map(cb => cb.value);
}

document.getElementById("submit-button").addEventListener("click", () => {
  const fileInput = document.getElementById("content-upload");
  const file = fileInput.files[0];

  if (!file) return alert("Please select a file to upload.");
  if (!isValidFile(file)) return;
  if (scanCount >= limits[tier].scans) {
    return alert(`⚠️ You have reached your scan limit for the ${tier} plan.`);
  }

  scanCount += 1;
  localStorage.setItem("checkreel_scan_count", scanCount);
  updateScanCounter();

  const selectedPlatforms = getSelectedValues("platform-options");
  const selectedRegions = getSelectedValues("region-options");

  const entry = {
    filename: file.name,
    timestamp: new Date().toLocaleString(),
    platforms: selectedPlatforms,
    regions: selectedRegions
  };

  saveHistoryEntry(entry);
  renderHistory();

  document.getElementById("result-section").style.display = "block";
  document.getElementById("ai-feedback").textContent = "Analyzing...";

  setTimeout(() => {
    document.getElementById("ai-feedback").textContent =
      "✅ Analysis complete. Your content complies with platform guidelines.";
  }, 2000);
});

// Export to JSON
document.getElementById("export-history-json").addEventListener("click", () => {
  const history = localStorage.getItem("checkreel_history");
  if (!history) return alert("No history to export.");
  const blob = new Blob([history], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "checkreel_history.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Export to TXT
document.getElementById("export-history-txt").addEventListener("click", () => {
  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
  if (!history.length) return alert("No history to export.");

  const lines = history.map(
    (item, i) => `${i + 1}. ${item.timestamp} — ${item.filename}\n  Platforms: ${item.platforms.join(', ')}\n  Regions: ${item.regions.join(', ')}\n`
  ).join('\n');

  const blob = new Blob([lines], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "checkreel_history.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

window.addEventListener("DOMContentLoaded", () => {
  resetIfNewMonth();
  document.getElementById("plan-tier").textContent = tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";
  updateScanCounter();
  renderHistory();
});
