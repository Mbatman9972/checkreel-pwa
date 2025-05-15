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
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      el.innerHTML = translations[key] || el.innerHTML;
    });
  }

  document.getElementById('language-select')?.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    if (selectedLang !== currentLang) loadLanguage(selectedLang);
  });

  loadLanguage(currentLang);
})();
