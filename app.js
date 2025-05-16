/* CheckReel – multilingual fix v2.8 */
document.addEventListener('DOMContentLoaded', async () => {
  const langSel = document.getElementById('language-select');
  const lang = localStorage.getItem('selectedLanguage') || 'en';
  langSel.value = lang;

  langSel.onchange = e => {
    localStorage.setItem('selectedLanguage', e.target.value);
    location.reload();
  };

  // ----- Load language JSON -----
  async function loadLanguageData(language) {
    try {
      const res = await fetch(`lang/${language}.json`);
      return await res.json();
    } catch (err) {
      console.error(`❌ Failed to load lang/${language}.json`, err);
      return {};
    }
  }

  // ----- Apply translations -----
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
    // Also set <title>
    if (translations['home-page-title']) {
      document.title = translations['home-page-title'];
    }
  }

  const translations = await loadLanguageData(lang);
  applyTranslations(translations);

  // ----- Active Users Counter -----
  const ACTIVE_KEY = 'cr-active-count';
  const BASE_COUNT = 2697;

  function getActiveCount() {
    return +(localStorage.getItem(ACTIVE_KEY) || BASE_COUNT);
  }

  function increaseCount() {
    const updated = getActiveCount() + 1;
    localStorage.setItem(ACTIVE_KEY, updated);
  }

  const usersTextRaw = translations['home-active-users'] || `🎯 ${getActiveCount()} active users`;
  const activeUsersEl = document.getElementById('active-users');
  if (activeUsersEl && usersTextRaw.includes('{count}')) {
    activeUsersEl.textContent = usersTextRaw.replace('{count}', getActiveCount().toLocaleString());
  } else if (activeUsersEl) {
    activeUsersEl.textContent = `🎯 ${getActiveCount().toLocaleString()} active users`;
  }

  // ----- Subscribe handler -----
  document.getElementById('subscribe-form').onsubmit = e => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email.');

    try {
      localStorage.setItem('checkreel-user-email', email);
      increaseCount();
      window.location.href = 'dashboard.html';
    } catch {
      alert('⚠️ Server error. Try again later.');
    }
  };
});
