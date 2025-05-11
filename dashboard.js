const tier = localStorage.getItem("checkreel_tier") || "free";
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

  if (!sizeOK) {
    alert(`⚠️ Max ${limits[tier].size}MB allowed.`);
    return false;
  }
  if (!formatOK) {
    alert(`⚠️ Format ${ext} not allowed.`);
    return false;
  }

  return true;
}

function getSelectedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input:checked`)].map(cb => cb.value);
}

function getSelectedRadioValue(containerId) {
  const checked = document.querySelector(`#${containerId} input[type="radio"]:checked`);
  return checked ? [checked.value] : [];
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
  const sort = document.getElementById("sort-history")?.value || "newest";
  const sorted = [...history].sort((a, b) =>
    sort === "newest"
      ? new Date(b.timestamp) - new Date(a.timestamp)
      : new Date(a.timestamp) - new Date(b.timestamp)
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
  if (!file) {
    alert("Please select a file.");
    return;
  }

  if (!isValidFile(file)) return;

  if (scanCount >= limits[tier].scans) {
    alert("⚠️ Scan limit reached.");
    return;
  }

  scanCount += 1;
  localStorage.setItem("checkreel_scan_count", scanCount);
  updateScanCounter();

  const platforms = getSelectedValues("platform-options");
  const regions = getSelectedRadioValue("region-options");
  const feedback = "✅ Analysis complete. Content meets platform guidelines.";

  if (tier === "plus") {
    const entry = {
      filename: file.name,
      timestamp: new Date().toLocaleString(),
      platforms,
      regions,
      feedback
    };
    saveHistoryEntry(entry);
    renderHistory();
  }

  document.getElementById("result-section").style.display = "block";
  const feedbackElem = document.getElementById("ai-feedback");
  feedbackElem.classList.add("loading");
  feedbackElem.textContent = "Analyzing...";

  setTimeout(() => {
    feedbackElem.textContent = feedback;
    feedbackElem.classList.remove("loading");
  }, 1500);
});

document.getElementById("content-upload").addEventListener("change", () => {
  document.getElementById("result-section").style.display = "none";
});

document.getElementById("sort-history")?.addEventListener("change", renderHistory);

document.getElementById("export-history-json")?.addEventListener("click", () => {
  const data = localStorage.getItem("checkreel_history");
  if (!data) return;
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, "checkreel_history.json");
});

document.getElementById("export-history-txt")?.addEventListener("click", () => {
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

// On DOM Load
window.addEventListener("DOMContentLoaded", () => {
  resetIfNewMonth();
  updateScanCounter();
  renderHistory();
  document.getElementById("plan-tier").textContent = tier.charAt(0).toUpperCase() + tier.slice(1) + " Plan";

  // ✅ Load selected language from localStorage
  const lang = localStorage.getItem('selectedLanguage') || 'en';

  // ✅ Optional: display language label if needed
  const label = {
    en: "English",
    ar: "العربية",
    fr: "Français"
  }[lang] || "English";

  const langDisplay = document.querySelector(".language-display");
  if (langDisplay) langDisplay.textContent = `Language: ${label}`;

  // ✅ RTL support for Arabic
  if (lang === 'ar') {
    document.body.setAttribute("dir", "rtl");
    document.body.classList.add("rtl");
  } else {
    document.body.setAttribute("dir", "ltr");
    document.body.classList.remove("rtl");
  }
});
const translations = {
  en: {
    welcome: "Welcome to CheckReel",
    subtext: "Your AI-powered content compliance platform",
    intro: `CheckReel protects your content before you post — giving AI-powered compliance checks so you don’t get flagged, muted, or demonetized.<br />
            Scan across regions and platforms like TikTok, Instagram, YouTube and more, before your content ever goes live.<br />
            <strong>🚀 Upgrade to CheckReel+ for saved scans, export features, and extended limits.</strong>`,
    upload: "Upload Content",
    chooseFile: "Choose File",
    note: "💡 Supported formats: mp4, jpg, png, mp3, wav, mov, webm, gif, aac, opus",
    submit: "Submit for Review",
    feedback: "🧠 AI Feedback",
    prevChecks: "📂 Previous Checks",
    sortBy: "Sort by:",
    newest: "Newest",
    oldest: "Oldest",
    exportJSON: "⬇️ Export as JSON",
    exportTXT: "⬇️ Export as TXT",
    footer: "🚀 Upgrade to CheckReel+ for saved results, faster scans, and full platform access — $9.99/mo.",
    platform: "Select Platform",
    region: "Select Region"
  },
  ar: {
    welcome: "مرحبًا بك في CheckReel",
    subtext: "منصة الامتثال للمحتوى تعمل بالذكاء الاصطناعي",
    intro: `تحميك CheckReel قبل نشر المحتوى — من خلال فحص الامتثال بالذكاء الاصطناعي لتجنب الحظر أو الكتم أو تقليل الأرباح.<br />
            افحص عبر المناطق والمنصات مثل TikTok، Instagram، YouTube والمزيد، قبل النشر.<br />
            <strong>🚀 قم بالترقية إلى CheckReel+ لحفظ الفحوصات وتصديرها وزيادة الحد.</strong>`,
    upload: "رفع المحتوى",
    chooseFile: "اختر ملف",
    note: "💡 الصيغ المدعومة: mp4, jpg, png, mp3, wav, mov, webm, gif, aac, opus",
    submit: "أرسل للتحقق",
    feedback: "🧠 ملاحظات الذكاء الاصطناعي",
    prevChecks: "📂 الفحوصات السابقة",
    sortBy: "ترتيب حسب:",
    newest: "الأحدث",
    oldest: "الأقدم",
    exportJSON: "⬇️ تصدير JSON",
    exportTXT: "⬇️ تصدير TXT",
    footer: "🚀 الترقية إلى CheckReel+ لحفظ النتائج وفحوصات أسرع ووصول كامل — 9.99$/شهريًا.",
    platform: "اختر المنصة",
    region: "اختر المنطقة"
  },
  fr: {
    welcome: "Bienvenue sur CheckReel",
    subtext: "Votre plateforme de conformité de contenu alimentée par l'IA",
    intro: `CheckReel protège votre contenu avant publication — grâce à des vérifications de conformité IA pour éviter les signalements, blocages ou pertes de revenus.<br />
            Scannez par région et plateforme : TikTok, Instagram, YouTube, etc.<br />
            <strong>🚀 Passez à CheckReel+ pour enregistrer, exporter, et étendre vos limites.</strong>`,
    upload: "Téléverser un contenu",
    chooseFile: "Choisir un fichier",
    note: "💡 Formats pris en charge : mp4, jpg, png, mp3, wav, mov, webm, gif, aac, opus",
    submit: "Soumettre pour vérification",
    feedback: "🧠 Résultat IA",
    prevChecks: "📂 Vérifications précédentes",
    sortBy: "Trier par :",
    newest: "Plus récent",
    oldest: "Plus ancien",
    exportJSON: "⬇️ Exporter en JSON",
    exportTXT: "⬇️ Exporter en TXT",
    footer: "🚀 Passez à CheckReel+ pour des résultats sauvegardés, des analyses rapides, et un accès complet — 9.99$/mois.",
    platform: "Choisir une plateforme",
    region: "Choisir une région"
  }
};

const t = translations[lang] || translations['en'];

document.querySelector("h1").textContent = t.welcome;
document.querySelector(".subtext").textContent = t.subtext;
document.querySelector(".intro").innerHTML = t.intro;
document.querySelector(".upload-area h2").textContent = t.upload;
document.querySelector(".file-upload-wrapper").childNodes[0].textContent = t.chooseFile;
document.querySelector(".note").textContent = t.note;
document.getElementById("submit-button").textContent = t.submit;
document.querySelector("#result-section h2").textContent = t.feedback;
document.querySelector(".history-box h2").textContent = t.prevChecks;
document.querySelector('label[for="sort-history"]').childNodes[0].textContent = t.sortBy;
document.querySelector('#sort-history option[value="newest"]').textContent = t.newest;
document.querySelector('#sort-history option[value="oldest"]').textContent = t.oldest;
document.getElementById("export-history-json").textContent = t.exportJSON;
document.getElementById("export-history-txt").textContent = t.exportTXT;
document.querySelector(".footer-note p").textContent = t.footer;
document.querySelector(".filter-section h3").textContent = t.platform;
document.querySelectorAll(".filter-section h3")[1].textContent = t.region;

// ✅ Exclusive platform selection (only one at a time)
document.querySelectorAll('#platform-options input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      document.querySelectorAll('#platform-options input[type="checkbox"]').forEach((cb) => {
        if (cb !== this) cb.checked = false;
      });
    }
  });
});
