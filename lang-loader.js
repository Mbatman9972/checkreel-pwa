(function () {
  const DEFAULT_LANG = 'en';
  const LANG_KEY = 'selectedLanguage';
  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  let translations = {};

  async function loadLanguage(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!data || !Object.keys(data).length) throw new Error();
      translations = data;
      currentLang = lang;
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      if (lang !== DEFAULT_LANG) return loadLanguage(DEFAULT_LANG);
    }

    applyTranslations();
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Update select box value
    const langSelect = document.getElementById("language-select");
    if (langSelect) langSelect.value = currentLang;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (translations[key]) el.innerHTML = translations[key];
    });
  }

  document.getElementById('language-select')?.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (selected !== currentLang) loadLanguage(selected);
  });

  loadLanguage(currentLang);
})();
