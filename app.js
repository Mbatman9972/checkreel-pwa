/* ============= I18N ============= */
let translations = {};
let currentLang  = 'en';

async function loadLanguage(lang) {
  currentLang = lang;
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
  } catch {                         // fallback if the file is missing or invalid
    translations = {};
  }
  applyTranslations();
  updateActiveUsers();
}

function t(path, fallback = '') {
  // Very small helper to fetch deep keys safely
  return path.split('.').reduce((o, k) => (o ?? {})[k], translations) ?? fallback;
}

function applyTranslations() {
  /* ----- hero block ----- */
  document.getElementById('hero-title'      ).innerText = t('heroTitle'   , 'CheckReel');
  document.getElementById('hero-subtitle'   ).innerText = t('heroSubtitle', 'Stop guessing, start checking.');

  const benefits = t('heroBenefits', [
      '✅ Scan your media before it backfires',
      '📊 Real-time reports',
      '🔒 Privacy-focused'
  ]);
  document.getElementById('hero-benefits').innerHTML =
        benefits.map(b => `<li>${b}</li>`).join('');

  /* ----- subscription box ( the 4 items you asked for ) ----- */
  document.getElementById('email-input'      ).placeholder = t('subscription.placeholder', 'Enter your email');
  document.getElementById('subscribe-button' ).innerText   = t('subscription.button'     , 'Subscribe');
  document.getElementById('subscription-note').innerText   = t('subscription.note'       , '$4.99 / month after trial');

  /* ----- section titles ----- */
  document.getElementById('platforms-title').innerText = t('platformsTitle', 'Supported Platforms');
  document.getElementById('about-title'    ).innerText = t('about.title'   , 'About CheckReel');

  /* ----- about paragraph ----- */
  document.getElementById('about-content').innerText =
    t('about.content',
      'CheckReel helps creators ensure their content complies with platform guidelines before posting.');
}

/* ============= language switcher ============= */
document.getElementById('language-switcher')
        .addEventListener('change', e => loadLanguage(e.target.value));

/* ============= active-user counter ============= */
let activeUsers = 2_697;

function updateActiveUsers() {
  const fmt = t('subscription.count', '🎯 {count} Active Users');
  document.getElementById('active-users').innerText =
        fmt.replace('{count}', activeUsers);
}

/* ============= subscription (Apps Script backend) ============= */
const API_URL = 'https://script.google.com/macros/s/AKfycbwKWcb5Tx2wHhyGn5Bwec4nwumlSibm9VPpJ2lR269M8e_xt-x7bUe2GmZX17FKJRk/exec';

async function subscribeUser(email) {
  try {
    const r = await fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`);
    const j = await r.json();
    if (j.result === 'success') {
      alert('✅ Thanks for subscribing! Check your email.');
      document.getElementById('email-input').value = '';
      activeUsers++; updateActiveUsers();
    } else {
      alert(`⚠️ ${j.message || 'Subscription failed.'}`);
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Server error. Try again later.');
  }
}

/* ============= form handler ============= */
document.getElementById('subscribe-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email-input').value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    subscribeUser(email);
  } else {
    alert('⚠️ Please enter a valid email address.');
  }
});

/* ============= first load ============= */
loadLanguage(currentLang);
