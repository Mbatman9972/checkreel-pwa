// Define translations
let translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  applyTranslations();
}

function applyTranslations() {
  document.getElementById('hero-title').innerText = translations.heroTitle;
  document.getElementById('hero-subtitle').innerText = translations.heroSubtitle;

  const benefitsHtml = translations.heroBenefits.map(b => `<p>${b}</p>`).join('');
  document.getElementById('hero-benefits').innerHTML = benefitsHtml;

  document.getElementById('start-trial').innerText = translations.startTrial;

  document.getElementById('platforms-title').innerText = translations.platformsTitle;

  document.getElementById('subscription-title').innerText = translations.subscription.title;
  document.getElementById('email-input').placeholder = translations.subscription.placeholder;
  document.getElementById('subscribe-button').innerText = translations.subscription.button;
  document.getElementById('subscription-note').innerText = translations.subscription.note;

  document.getElementById('about-title').innerText = translations.about.title;
  document.getElementById('about-content').innerText = translations.about.content;
}

document.getElementById('language-switcher').addEventListener('change', (e) => {
  loadLanguage(e.target.value);
});

loadLanguage(currentLang);

// Counter
let activeUsers = 2697;
const activeUsersElement = document.getElementById('active-users');
function updateActiveUsers() {
  activeUsers++;
  activeUsersElement.innerText = translations.subscription.count.replace('{count}', activeUsers);
}
setInterval(updateActiveUsers, 15000);
