(function () {
  const lang = localStorage.getItem('selectedLanguage') || 'en';

  async function loadLangFile(lang) {
    try {
      const response = await fetch(`lang/${lang}.json`);
      const translations = await response.json();

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
          el.innerHTML = translations[key];
        }
      });

      // Set document language and direction
      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    } catch (error) {
      console.error('[lang-loader] Failed to load translation:', error);
    }
  }

  loadLangFile(lang);
})();
