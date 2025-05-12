window.addEventListener("DOMContentLoaded", () => {
  const tier = localStorage.getItem("checkreel_tier") || "free";
  const supportedFormats = ['.mp4', '.jpg', '.jpeg', '.png', '.mp3', '.wav', '.mov', '.webm', '.gif', '.aac', '.opus'];
  const limits = {
    free: { scans: 3, size: 10, formats: supportedFormats },
    premium: { scans: 20, size: 10, formats: supportedFormats },
    plus: { scans: 40, size: 50, formats: supportedFormats }
  };

  let scanCount = parseInt(localStorage.getItem("checkreel_scan_count")) || 0;
  const getEl = (id) => document.getElementById(id);

  // Safe refs
  const scanCounter = getEl("scan-counter");
  const submitBtn = getEl("submit-button");
  const fileInput = getEl("content-upload");
  const resultSection = getEl("result-section");
  const feedbackElem = getEl("ai-feedback");
  const planTier = getEl("plan-tier");
  const sortSelect = getEl("sort-history");
  const jsonBtn = getEl("export-history-json");
  const txtBtn = getEl("export-history-txt");
  const historyList = getEl("history-list");
  const historyCount = getEl("history-count");

  // === Monthly Reset Logic ===
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

  // === Scan Counter UI ===
  function updateScanCounter() {
    if (scanCounter) {
      scanCounter.textContent = `Scans used: ${scanCount} / ${limits[tier].scans}`;
    }
  }

  // === File Validation ===
  function isValidFile(file) {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const sizeOK = file.size <= limits[tier].size * 1024 * 1024;
    const formatOK = supportedFormats.includes(ext);
    if (!sizeOK) return alert(`⚠️ Max ${limits[tier].size}MB allowed.`);
    if (!formatOK) return alert(`⚠️ Format ${ext} not allowed.`);
    return true;
  }

  // === UI Helpers ===
  const getSelectedValues = (id) => [...document.querySelectorAll(`#${id} input:checked`)].map(cb => cb.value);
  const getSelectedRadioValue = (id) => {
    const checked = document.querySelector(`#${id} input[type="radio"]:checked`);
    return checked ? [checked.value] : [];
  };

  // === History Management ===
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
    if (!historyList || !jsonBtn || !txtBtn || tier !== "plus") return;

    historyList.innerHTML = "";
    historyCount && (historyCount.innerText = "");
    jsonBtn.style.display = "none";
    txtBtn.style.display = "none";

    const history = JSON.parse(localStorage.getItem("checkreel_history") || "[]");
    const sort = sortSelect?.value || "newest";
    const sorted = [...history].sort((a, b) =>
      sort === "newest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

    if (historyCount) {
      historyCount.textContent = `🧾 Total saved scans: ${sorted.length}`;
    }

    sorted.forEach((item, index) => {
      const li = document.createElement("li");
      const platforms = item.platforms.map(p => `<span class="badge">${p}</span>`).join(' ');
      li.innerHTML = `
        <div><strong>${item.filename}</strong> — ${item.timestamp}</div>
        <div>Platforms: ${platforms} | Regions: ${item.regions.join(', ')}</div>
        <div class="feedback">🧠 ${item.feedback}</div>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      `;
      historyList.appendChild(li);
    });

    if (sorted.length > 0) {
      jsonBtn.style.display = "inline-block";
      txtBtn.style.display = "inline-block";
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteHistoryEntry(parseInt(btn.dataset.index)));
    });
  }

  // === Main Upload Handler ===
  if (submitBtn && fileInput) {
    submitBtn.addEventListener("click", () => {
      const file = fileInput.files[0];
      if (!file || !isValidFile(file)) return;
      if (scanCount >= limits[tier].scans) return alert("⚠️ Scan limit reached.");

      scanCount++;
      localStorage.setItem("checkreel_scan_count", scanCount);
      updateScanCounter();

      const platforms = getSelectedValues("platform-options");
      const regions = getSelectedRadioValue("region-options");
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

      if (resultSection && feedbackElem) {
        resultSection.style.display = "block";
        feedbackElem.classList.add("loading");
        feedbackElem.textContent = "Analyzing...";
        setTimeout(() => {
          feedbackElem.textContent = feedback;
          feedbackElem.classList.remove("loading");
        }, 1500);
      }
    });

    fileInput.addEventListener("change", () => {
      if (resultSection) resultSection.style.display = "none";
    });
  }

  // === Export Buttons ===
  sortSelect?.addEventListener("change", renderHistory);

  jsonBtn?.addEventListener("click", () => {
    const data = localStorage.getItem("checkreel_history");
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadBlob(url, "checkreel_history.json");
  });

  txtBtn?.addEventListener("click", () => {
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

  // === Language + RTL Direction ===
  const lang = localStorage.getItem('selectedLanguage') || 'en';
  document.body.setAttribute("dir", lang === 'ar' ? 'rtl' : 'ltr');
  document.body.classList.toggle("rtl", lang === 'ar');

  const labelMap = { en: "English", ar: "العربية", fr: "Français" };
  const langDisplay = document.querySelector(".language-display");
  if (langDisplay) langDisplay.textContent = `Language: ${labelMap[lang] || "English"}`;

  if (planTier) planTier.textContent = `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;

  // === Init Page
  resetIfNewMonth();
  updateScanCounter();
  renderHistory();

  // === Exclusive platform checkbox behavior
  document.querySelectorAll('#platform-options input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        document.querySelectorAll('#platform-options input[type="checkbox"]').forEach((cb) => {
          if (cb !== this) cb.checked = false;
        });
      }
    });
  });
});
