// Initialize translations
let translations = {};
let currentLang = 'en';

// Load language JSON
async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  applyTranslations();
}

// Apply translations to page
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

// Language switcher
document.getElementById('language-switcher').addEventListener('change', (e) => {
  loadLanguage(e.target.value);
});

// Load default language
loadLanguage(currentLang);

// Active subscribers counter
let activeUsers = 2697;
const activeUsersElement = document.getElementById('active-users');

function updateActiveUsers() {
  if (translations.subscription?.count) {
    activeUsersElement.innerText = translations.subscription.count.replace('{count}', activeUsers);
  } else {
    activeUsersElement.innerText = `🎯 ${activeUsers} Active Users`;
  }
}
updateActiveUsers(); // Initial set without auto-growing anymore

// Checkreel subscription

// Correct final deployed Apps Script URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwuDs_Ro2-YsqJiQnTyOuzKrJAlGVyeCGeq-Kv6ujM_CdYGcJLXa2JkXrMM3J8bquI/exec';

function subscribeUser(email) {
  fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        alert('✅ Thanks for subscribing! Check your email.');
        document.getElementById('email-input').value = '';
        // Temporary testing: Increase counter by 1 when user subscribes
        activeUsers++;
        updateActiveUsers();
      } else {
        alert('⚠️ Oops! Something went wrong.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('⚡ Server error. Please try again later.');
    });
}

document.getElementById('subscribe-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email-input').value.trim();
  if (email) {
    subscribeUser(email);
  } else {
    alert('⚠️ Please enter a valid email address.');
  }
});
