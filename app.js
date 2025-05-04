// ------------- Translations -------------
let translations = {};
let currentLang  = 'en';

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
  } catch {
    translations = {};                // fallback if file missing
  }
  applyTranslations();
  updateActiveUsers();
}

function applyTranslations() {
  const t = translations;             // alias

  document.getElementById('hero-title'   ).innerText = t.heroTitle      ?? 'CheckReel';
  document.getElementById('hero-subtitle').innerText = t.heroSubtitle   ?? 'Stop guessing – start checking.';

  // benefits list
  const benefits = t.heroBenefits ?? [
    '✅ Scan your media before it backfires',
    '✅ AI checks for video, audio & images',
    '✅ Free trial: 3 total scans',
    '✅ $4.99 / month unlimited'
  ];
  document.getElementById('hero-benefits').innerHTML =
     benefits.map(line => `<li>${line}</li>`).join('');

  // subscribe UI
  document.getElementById('email-input'     ).placeholder = t.subscription?.placeholder ?? 'Enter your email';
  document.getElementById('subscribe-button').innerText   = t.subscription?.button      ?? 'Subscribe';
  document.getElementById('subscription-note').innerText  = t.subscription?.note        ?? '$4.99 / month after trial';

  // section titles / about
  document.getElementById('platforms-title').innerText = t.platformsTitle ?? 'Supported Platforms';
  document.getElementById('about-title'    ).innerText = t.about?.title   ?? 'About CheckReel';
  document.getElementById('about-content'  ).innerText = t.about?.content ??
    'CheckReel is part of Alwafer Media, helping creators stay compliant before publishing.';
}

// language switcher
document.getElementById('language-switcher')
        .addEventListener('change', e => loadLanguage(e.target.value));

loadLanguage(currentLang);            // initial

// ------------- Active-user counter -------------
let activeUsers = 2697;
function updateActiveUsers() {
  const fmt = translations.subscription?.count ?? '🎯 {count} Active Users';
  document.getElementById('active-users').innerText =
        fmt.replace('{count}', activeUsers);
}

// ------------- Subscription (Google Apps Script) -------------
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

document.getElementById('subscribe-form')
        .addEventListener('submit', e => {
          e.preventDefault();
          const email = document.getElementById('email-input').value.trim();
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) subscribeUser(email);
          else alert('⚠️ Please enter a valid email address.');
        });
