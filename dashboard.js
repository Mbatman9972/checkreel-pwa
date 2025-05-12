// ---------- language support ----------
let translations = {};
let currentLang   = 'en';

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`).catch(() => null);
  translations = res ? await res.json() : {};
  currentLang  = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  applyTranslations();
}
function txt(path, fallback = '') {
  return path.split('.').reduce((o, k) => (o || {})[k], translations) || fallback;
}
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = txt(el.dataset.i18n, el.innerHTML);
  });
}
// default English on first load
loadLanguage('en');

// ---------- platform select ----------
const platformButtons = [...document.querySelectorAll('.platform')];
let selectedPlatform = 'tiktok';

platformButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    platformButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPlatform = btn.id;
  });
});

// ---------- region select ----------
let selectedRegion = 'mena';
document.getElementById('regions').addEventListener('change', e => {
  if (e.target.name === 'region') selectedRegion = e.target.value;
});

// ---------- scan placeholder ----------
document.getElementById('scanBtn').addEventListener('click', () => {
  const file     = document.getElementById('fileInput').files[0];
  if (!file) return alert('Choose a file first');
  // Mock result
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleTimeString()} — ${file.name} ✓ [${selectedPlatform.toUpperCase()} • ${selectedRegion.toUpperCase()}]`;
  document.getElementById('history').prepend(li);
});
