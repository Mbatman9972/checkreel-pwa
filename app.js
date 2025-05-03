// -------------- configuration --------------
const API_URL =
  'https://script.google.com/macros/s/AKfycbwKWcb5Tx2wHhyGn5Bwec4nwumlSibm9VPpJ2lR269M8e_xt-x7bUe2GmZX17FKJRk/exec';

// -------------- i18n -----------------------
let translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  renderTexts();
  updateActiveUsers();
}

function renderTexts() {
  _txt('hero-title', 'heroTitle');
  _txt('hero-subtitle', 'heroSubtitle');
  _html('hero-benefits', translations.heroBenefits?.map(b => `<p>✅ ${b}</p>`).join(''));

  _txt('subscribe-button', 'subscription.button');
  _attr('email-input', 'placeholder', translations.subscription.placeholder);
  _txt('subscription-note', 'subscription.note');

  _txt('platforms-title', 'platformsTitle');
  _txt('about-title', 'about.title');
  _txt('about-content', 'about.content');
}

function _txt(id, path) {
  const el = document.getElementById(id);
  const val = path.split('.').reduce((o, k) => o?.[k], translations);
  if (el && val) el.innerText = val;
}
function _html(id, html) { const el = document.getElementById(id); if (el && html) el.innerHTML = html; }
function _attr(id, attr, val) { const el = document.getElementById(id); if (el && val) el.setAttribute(attr, val); }

// -------------- active users counter -------
let activeUsers = 2697;
function updateActiveUsers() {
  const el = document.getElementById('active-users');
  if (!el) return;
  const tpl = translations?.subscription?.count ?? '🎯 {count} Active Users';
  el.innerText = tpl.replace('{count}', activeUsers);
}

// -------------- subscribe ------------------
async function subscribeUser(email) {
  try {
    const res = await fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data.result === 'success') {
      alert('✅ Thanks for subscribing! Check your email.');
      document.getElementById('email-input').value = '';
      activeUsers++;
      updateActiveUsers();
    } else {
      alert(`⚠️ ${data.message || 'Something went wrong.'}`);
    }
  } catch (err) {
    console.error(err);
    alert('⚡ Server error. Try again.');
  }
}

// -------------- listeners ------------------
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('subscribe-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (email) subscribeUser(email);
    else alert('⚠️ Please enter a valid email address.');
  });

  document.getElementById('language-switcher').addEventListener('change', e => {
    loadLanguage(e.target.value);
  });

  loadLanguage(currentLang); // first render
});
