import { getUserPlan, getPlanLimit, remainingQuota } from "./tier.js";

// Load platform+region rules
let rules = {};
fetch("data/rules.json")
  .then(res => res.json())
  .then(json => rules = json);

document.addEventListener("DOMContentLoaded", () => {
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

  // Track selected platform
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

  // File input
  const fileInput = document.getElementById("fileInput");
  const fileTxt = document.getElementById("fileLabelText");
  if (fileInput && fileTxt) {
    fileInput.onchange = () => {
      fileTxt.textContent = fileInput.files[0]?.name || "Choose a file…";
    };
  }

  // Scan button
  const historyUl = document.getElementById("history");
  const scanBtn = document.getElementById("scanBtn");

  if (scanBtn && fileInput && fileTxt) {
    scanBtn.onclick = () => {
      const file = fileInput.files[0];
      if (!file) return alert("Choose a file first");
      if (!platform) return alert("Please select a platform");
      if (!window.region) return alert("Please select a region");

      const plan = getUserPlan();
      const used = Number(localStorage.getItem("scanCount")) || 0;
      const limit = getPlanLimit(plan);
      if (used >= limit) return showUpgrade();
      localStorage.setItem("scanCount", used + 1);
      renderQuota();

      // ✅ Rule Check Patch — show console analysis
      const region = window.region;
      const platformRules = rules?.platforms?.[platform];
      if (platformRules) {
        const global = platformRules.global || {};
        const regional = platformRules?.regional_exceptions?.[region] || {};
        console.group(`📜 Rules for ${platform.toUpperCase()} - ${region}`);
        console.log("Global Rules:", global);
        console.log("Regional Rules:", regional);
        console.groupEnd();
      }

      // Simulate AI scan tag
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
          `  ${file.name} ✓ [${platform.toUpperCase()} · ${region}] — ${new Date().toLocaleTimeString()}`
        ),
        tag
      );
      if (historyUl) historyUl.prepend(li);

      fileInput.value = "";
      fileTxt.textContent = "Choose a file…";
    };
  }

  // Upgrade modal
  const modal = document.getElementById("upgradeModal");
  const closeBtn = document.getElementById("closeModal");
  const goBtn = document.getElementById("goUpgrade");

  function showUpgrade() {
    if (modal) modal.classList.remove("hidden");
  }

  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.add("hidden");
  }

  if (goBtn) {
    goBtn.onclick = () => {
      window.open("https://www.alwaferr.com/payment/checkreel-premium", "_blank");
    };
  }
});
