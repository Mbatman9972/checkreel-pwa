import { getUserPlan, getPlanLimit, remainingQuota, setUserPlan } from "./tier.js";

document.addEventListener("DOMContentLoaded", () => {
  const quotaBar = document.getElementById("quotaBar");
  const planSelect = document.getElementById("planSelect");
  const planLabel = document.getElementById("planLabel");

  // Language support for 'Plan:' label
  const currentLang = sessionStorage.getItem("lang") || "en";
  fetch(`lang/${currentLang}.json`)
    .then(res => res.json())
    .then(translations => {
      if (planLabel && translations?.dashboard?.planLabel) {
        planLabel.textContent = translations.dashboard.planLabel;
      }
    });

  // Plan Selector Logic
  if (planSelect) {
    planSelect.value = getUserPlan();
    planSelect.addEventListener("change", () => {
      setUserPlan(planSelect.value);
      renderQuota();
    });
  }

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

  // Platform Selection
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

  // File Upload UI
  const fileInput = document.getElementById("fileInput");
  const fileTxt = document.getElementById("fileLabelText");
  if (fileInput && fileTxt) {
    fileInput.onchange = () => {
      fileTxt.textContent = fileInput.files[0]?.name || "Choose a file…";
    };
  }

  // Scan Handler
  const scanBtn = document.getElementById("scanBtn");
  const historyUl = document.getElementById("history");
  if (scanBtn && fileInput && fileTxt) {
    scanBtn.onclick = () => {
      const file = fileInput.files[0];
      if (!file) return alert("Choose a file first");
      if (!platform) return alert("Please select a platform");
      if (!window.region) return alert("Please select a region");

      const plan = getUserPlan();
      const used = Number(localStorage.getItem("scanCount")) || 0;
      const limit = getPlanLimit(plan);

      if (used >= limit) {
        showUpgrade();
        return;
      }

      localStorage.setItem("scanCount", used + 1);
      renderQuota();

      // Simulated AI scan result
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

  // Upgrade Modal Logic
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
