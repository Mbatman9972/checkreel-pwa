import { getUserPlan, getPlanLimit, remainingQuota } from "./tier.js";

document.addEventListener("DOMContentLoaded", () => {
  /* Init quota badge */
  const quotaBar = document.getElementById("quotaBar");

  function renderQuota() {
    const used = Number(localStorage.getItem("scanCount")) || 0;
    const plan = getUserPlan();
    const limit = getPlanLimit(plan);
    const remaining = remainingQuota(used);

    if (quotaBar) {
      quotaBar.textContent =
        plan === "plus"
          ? "Plus · 40 scans"
          : plan === "premium"
          ? "Premium · 20 scans"
          : `Free · ${remaining} ${remaining === 1 ? "scan" : "scans"} left`;
    }
  }

  renderQuota();

  /* Platform selector */
  let platform = "";
  const platformWrap = document.getElementById("platforms");
  if (platformWrap) {
    platformWrap.addEventListener("click", e => {
      if (!e.target.classList.contains("platform")) return;
      document.querySelectorAll(".platform").forEach(b => b.classList.remove("selected"));
      e.target.classList.add("selected");
      platform = e.target.id;
    });
  }

  /* File label update */
  const fileInput = document.getElementById("fileInput");
  const fileTxt = document.getElementById("fileLabelText");
  if (fileInput && fileTxt) {
    fileInput.onchange = () => {
      fileTxt.textContent = fileInput.files[0]?.name || "Choose a file…";
    };
  }

  /* Scan button with AI result tag */
  const historyUl = document.getElementById("history");
  const scanBtn = document.getElementById("scanBtn");
  if (scanBtn && fileInput && fileTxt) {
    scanBtn.onclick = async () => {
      const file = fileInput.files[0];
      if (!file) return alert("Choose a file first");
      if (!platform) return alert("Please select a platform");
      if (!window.region) return alert("Please select a region");

      // Simulate quota check (temporary until backend exists)
const plan = getUserPlan();
const used = Number(localStorage.getItem("scanCount")) || 0;
const limit = getPlanLimit(plan);

if (used >= limit) {
  showUpgrade();
  return;
}

// Update local scan counter
localStorage.setItem("scanCount", used + 1);

      renderQuota();

      // Simulate AI result tag
      const passed = Math.random() > 0.3;
      const tag = document.createElement("span");
      tag.className = `scan-tag ${passed ? "passed" : "flagged"}`;
      tag.textContent = passed ? "✅ Passed" : "🚫 Flagged";

      const li = document.createElement("li");
      const icon = new Image();
      icon.src = `images/platform-logos/${platform}.png`;
      icon.alt = platform;
      icon.style.width = "22px";
      icon.style.height = "22px";

      li.append(
        icon,
        document.createTextNode(
          `  ${file.name} ✓ [${platform.toUpperCase()} · ${window.region.toUpperCase()}]  —  ${new Date().toLocaleTimeString()}`
        ),
        tag
      );

      if (historyUl) historyUl.prepend(li);

      fileInput.value = "";
      fileTxt.textContent = "Choose a file…";
    };
  }

  /* Upgrade modal actions */
  const modal = document.getElementById("upgradeModal");
  const closeBtn = document.getElementById("closeModal");
  const goBtn = document.getElementById("goUpgrade");

  function showUpgrade() {
    if (modal) modal.classList.remove("hidden");
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      if (modal) modal.classList.add("hidden");
    };
  }

  if (goBtn) {
    goBtn.onclick = () => {
      window.open("https://www.alwaferr.com/payment/checkreel-premium", "_blank");
    };
  }
});
