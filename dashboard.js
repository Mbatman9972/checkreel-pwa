// dashboard.js

// Retrieve user tier from localStorage or default to 'free'
const tier = localStorage.getItem("checkreel_tier") || "free";

// Define limits for each tier
const limits = {
  free: { scans: 3, size: 10, formats: ['.mp4', '.jpg', '.png', '.mp3'] },
  premium: { scans: 20, size: 10, formats: ['.mp4', '.jpg', '.png', '.mp3'] },
  plus: { scans: 40, size: 50, formats: ['.mp4', '.jpg', '.png', '.mp3', '.mov', '.wav', '.webm', '.gif'] }
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
  const formatOK = limits[tier].formats.includes(ext);

  if (!sizeOK) {
    alert(`⚠️ Your file exceeds the ${maxMB}MB limit for the ${tier} plan.`);
    return false;
  }
  if (!formatOK) {
    alert(`⚠️ Format “${ext}” isn’t supported on the ${tier} plan.\nAccepted: ${limits[tier].formats.join(', ')}`);
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

  if (!isValidFile(file)) {
    return;
  }

  if (scanCount >= limits[tier].scans) {
    alert(`⚠️ You have reached your scan limit for the ${tier} plan.`);
    return;
  }

  // Proceed with file processing (e.g., send to server or process locally)
  // ...

  // Increment scan count and update UI
  scanCount += 1;
  localStorage.setItem("checkreel_scan_count", scanCount);
  updateScanCounter();

  // Display AI feedback section
  document.getElementById("result-section").style.display = "block";
  document.getElementById("ai-feedback").textContent = "Analyzing...";

  // Simulate AI processing delay
  setTimeout(() => {
    document.getElementById("ai-feedback").textContent = "✅ Analysis complete. Your content complies with platform guidelines.";
  }, 2000);
});

// Initialize dashboard on page load
window.addEventListener("DOMContentLoaded", () => {
  // Set plan badge
  const planBadge = document.getElementById("plan-tier");
  planBadge.textContent = tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";

  // Update scan counter
  updateScanCounter();
});
