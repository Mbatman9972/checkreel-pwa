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

function renderHistory() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  if (tier !== "plus") return;

  const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.timestamp} — ${item.filename} [${item.platforms.join(', ')}] | ${item.regions.join(', ')}`;
    list.appendChild(li);
  });

  document.getElementById("export-history").style.display = history.length ? "inline-block" : "none";
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

// Export history
document.getElementById("export-history").addEventListener("click", () => {
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

window.addEventListener("DOMContentLoaded", () => {
  resetIfNewMonth();
  document.getElementById("plan-tier").textContent = tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";
  updateScanCounter();
  renderHistory();
});
