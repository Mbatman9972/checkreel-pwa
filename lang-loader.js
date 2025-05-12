/* lang-loader.js
   --------------------------------------------------------------------------
   Simple, resilient i18n loader for CheckReel.
   • Looks up lang file in /lang/<code>.json
   • Falls back to English if the file is missing or empty
   • Updates <html lang> & dir automatically
   • Saves / reads choice from localStorage ("selectedLanguage")
   • Exposes window.setLanguage(<code>) for external UI controls
   -------------------------------------------------------------------------- */
(function () {
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY  = 'selectedLanguage';

  let currentLang   = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  let translations  = {};

  /* ---------------------------------------------------------------------- */
  async function loadLanguage(lang) {
    try {
      const res = await fetch(`lang/${lang}.json`);
      if (!res.ok) throw new Error('file missing');
      const json = await res.json();
      if (!json || Object.keys(json).length === 0) throw new Error('empty file');

      translations = json;
      currentLang  = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      console.warn(`[lang-loader] ${lang} failed, reverting to "${DEFAULT_LANG}"`, err);
      if (lang !== DEFAULT_LANG) {
        return loadLanguage(DEFAULT_LANG);          // one retry, then give up
      }
      translations = {};                            // English text stays as-is
      currentLang  = DEFAULT_LANG;
      localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
    }

    applyTranslations();
    document.documentElement.lang = currentLang;
    document.documentElement.dir  = currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  /* ---------------------------------------------------------------------- */
  function t(path, fallback = '') {
    return path.split('.').reduce((o, k) => (o || {})[k], translations) || fallback;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = t(key, el.innerHTML);          // keep original as fallback
    });
  }

  /* expose setter for future language switch UI -------------------------- */
  window.setLanguage = function (langCode) {
    if (langCode && langCode !== currentLang) {
      loadLanguage(langCode);
    }
  };

  /* boot ----------------------------------------------------------------- */
  loadLanguage(currentLang);
})();
