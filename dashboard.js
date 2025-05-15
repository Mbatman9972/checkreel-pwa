import { getUserPlan, getPlanLimit, remainingQuota } from "./tier.js";

document.addEventListener("DOMContentLoaded", () => {
  /* Quota & Plan UI */
  const quotaBar = document.getElementById("quotaBar");
  const planSelect = document.getElementById("planSelect");

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

  if (planSelect) {
    planSelect.value = getUserPlan();
    planSelect.addEventListener("change", e => {
      localStorage.setItem("plan", e.target.value);
      localStorage.setItem("scanCount", 0);
      renderQuota();
    });
  }

  renderQuota();

  /* Platform Selection */
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

  /* Region Selection */
  let region = "";
  window.setRegion = r => (region = r); // Used by regionMap.js

  /* File Input Label */
  const fileInput = document.getElementById("fileInput");
  const fileTxt = document.getElementById("fileLabelText");
  if (fileInput && fileTxt) {
    fileInput.onchange = () => {
      fileTxt.textContent = fileInput.files[0]?.name || "Choose a file…";
    };
  }

  /* Scan Logic */
  const scanBtn = document.getElementById("scanBtn");
  const historyUl = document.getElementById("history");

  if (scanBtn && fileInput && fileTxt) {
    scanBtn.onclick = async () => {
      const file = fileInput.files[0];
      if (!file) return alert("Choose a file first");
      if (!platform) return alert("Please select a platform");
      if (!region) return alert("Please select a region");

      const plan = getUserPlan();
      const used = Number(localStorage.getItem("scanCount")) || 0;
      const limit = getPlanLimit(plan);

      if (used >= limit) {
        showUpgrade();
        return;
      }

      localStorage.setItem("scanCount", used + 1);
      renderQuota();

      // Simulate scan result
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
          `  ${file.name} ✓ [${platform.toUpperCase()} · ${region.toUpperCase()}] — ${new Date().toLocaleTimeString()}`
        ),
        tag
      );

      if (historyUl) historyUl.prepend(li);
      fileInput.value = "";
      fileTxt.textContent = "Choose a file…";
    };
  }

  /* Upgrade Modal */
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
