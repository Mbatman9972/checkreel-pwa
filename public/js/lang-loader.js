// lang-loader.js · CheckReel multilingual logic
document.addEventListener("DOMContentLoaded", async () => {
  const lang = localStorage.getItem("selectedLanguage") || "en";
  const sel = document.getElementById("language-select");

  if (sel) {
    sel.value = lang;
    sel.onchange = (e) => {
      localStorage.setItem("selectedLanguage", e.target.value);
      location.reload();
    };
  }

  async function loadLanguageData(language) {
    try {
      const res = await fetch(`lang/${language}.json`);
      return await res.json();
    } catch (err) {
      console.error(`❌ Failed to load lang/${language}.json`, err);
      return {};
    }
  }

  function applyTranslations(translations) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    if (translations["dashboard-page-title"]) {
      document.title = translations["dashboard-page-title"];
    }
  }

  const translations = await loadLanguageData(lang);
  applyTranslations(translations);
});
