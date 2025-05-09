// dashboard.js

// Retrieve user tier from localStorage or default to 'free'
const tier = localStorage.getItem("checkreel_tier") || "free";

// Define globally supported formats
const supportedFormats = ['.mp4', '.jpg', '.jpeg', '.png', '.mp3', '.wav', '.mov', '.webm', '.gif', '.aac'];

// Define scan/size limits per tier (formats are now universal)
const limits = {
  free: { scans: 3, size: 10, formats: supportedFormats },
  premium: { scans: 20, size: 10, formats: supportedFormats },
  plus: { scans: 40, size: 50, formats: supportedFormats }
};

// Retrieve current scan count from localStorage or default to 0
let scanCount = parseInt(localStorage.getItem("checkreel_scan_count")) || 0;

// Update scan counter UI
function updateScanCounter() {
  const counter = document.getElementById("scan-counter");
  counter.textContent = `Scans used: ${scanCount} / ${limits[tier].scans}`;
}

// Validate uploaded file
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
    alert(`⚠️ Format “${ext}” is not supported. Accepted formats: ${supportedFormats.join(', ')}`);
    return false;
  }

  return true;
}

// Handle file upload submission
document.getElementById("submit-button").addEventListener("click", () => {
  const fileInput = document.getElementById("content-upload");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  if (!isValidFile(file)) return;

  if (scanCount >= limits[tier].scans) {
    alert(`⚠️ You have reached your scan limit for the ${tier} plan.`);
    return;
  }

  // Simulate AI processing
  scanCount += 1;
  localStorage.setItem("checkreel_scan_count", scanCount);
  updateScanCounter();

  document.getElementById("result-section").style.display = "block";
  document.getElementById("ai-feedback").textContent = "Analyzing...";

  setTimeout(() => {
    document.getElementById("ai-feedback").textContent =
      "✅ Analysis complete. Your content complies with platform guidelines.";
  }, 2000);
});

// Initialize dashboard on load
window.addEventListener("DOMContentLoaded", () => {
  const planBadge = document.getElementById("plan-tier");
  planBadge.textContent = tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";
  updateScanCounter();
});
