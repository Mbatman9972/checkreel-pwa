(function () {
  const DEF = 'en', KEY = 'selectedLanguage';
  let cur = localStorage.getItem(KEY) || DEF, dict = {};

  async function load(lang) {
    try {
      const r = await fetch(`lang/${lang}.json`);
      if (!r.ok) throw 0;
      const j = await r.json();
      if (!j || !Object.keys(j).length) throw 0;
      dict = j;
      cur = lang;
      localStorage.setItem(KEY, lang);
    } catch {
      if (lang !== DEF) return load(DEF);
    }

    apply();
    document.documentElement.lang = cur;
    document.documentElement.dir = cur === 'ar' ? 'rtl' : 'ltr';

    // Set selector if it exists
    const langSel = document.getElementById("language-select");
    if (langSel) langSel.value = cur;
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (dict[k]) el.innerHTML = dict[k];
    });

    // Localize dashboard "Plan:" label if present
    const planLabel = document.querySelector('#planSelectorWrap span[data-i18n="plan-label"]');
    if (planLabel) {
      planLabel.textContent = dict['plan-label'] || 'Plan:';
    }
  }

  window.setLanguage = l => l !== cur && load(l);
  load(cur);
})();
