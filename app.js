// ---------- translations ----------
let translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
  } catch {
    translations = {};            // fallback if file missing
  }
  applyTranslations();
  updateActiveUsers();
}

function applyTranslations() {
  // text
  document.getElementById('hero-title'   ).innerText = translations.heroTitle        ?? 'CheckReel';
  document.getElementById('hero-subtitle').innerText = translations.heroSubtitle     ?? 'Stop guessing, start checking.';
  document.getElementById('platforms-title').innerText = translations.platformsTitle ?? 'Supported Platforms';
  document.getElementById('about-title' ).innerText = translations.about?.title      ?? 'About CheckReel';
  document.getElementById('about-content').innerText = translations.about?.content   ??
    'CheckReel helps creators ensure their content complies with platform guidelines before posting.';

  // benefits list
  const benefits = translations.heroBenefits ?? [
    '✅ Scan your media before it backfires',
    '✅ AI checks for video, audio, and images',
    '✅ Free trial: 3 total scans',
    '✅ $4.99 / month for unlimited access'
  ];
  document.getElementById('hero-benefits').innerHTML =
     benefits.map(t => `<li>${t}</li>`).join('');

  // subscribe box text
  document.getElementById('email-input').placeholder =
    translations.subscription?.placeholder ?? 'Enter your email';
  document.getElementById('subscribe-button').innerText =
    translations.subscription?.button ?? 'Subscribe';
  document.getElementById('subscription-note').innerText =
    translations.subscription?.note ?? '$4.99/month after the trial';
}

// language switcher
document.getElementById('language-switcher')
        .addEventListener('change', e => loadLanguage(e.target.value));

// ---------- active-user counter ----------
let activeUsers = 2697;
function updateActiveUsers() {
  const el = document.getElementById('active-users');
  const fmt = translations.subscription?.count ?? '🎯 {count} Active Users';
  el.innerText = fmt.replace('{count}', activeUsers);
}

// ---------- subscription (Google Apps Script) ----------
const API_URL = 'https://script.google.com/macros/s/AKfycbwKWcb5Tx2wHhyGn5Bwec4nwumlSibm9VPpJ2lR269M8e_xt-x7bUe2GmZX17FKJRk/exec';

async function subscribeUser(email) {
  try {
    const res   = await fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`);
    const reply = await res.json();
    if (reply.result === 'success') {
      alert('✅ Thanks for subscribing! Check your email.');
      document.getElementById('email-input').value = '';
      activeUsers++; updateActiveUsers();
    } else {
      alert(`⚠️ ${reply.message || 'Subscription failed.'}`);
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Server error. Try again later.');
  }
}

// form handler
document.getElementById('subscribe-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email-input').value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) subscribeUser(email);
  else alert('⚠️ Please enter a valid email address.');
});

// initial load
loadLanguage(currentLang);
