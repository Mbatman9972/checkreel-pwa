// ====== Translations Setup ======
let translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  applyTranslations();
  updateActiveUsers(); // moved inside to ensure translations are ready
}

function applyTranslations() {
  document.getElementById('hero-title').innerText = translations.heroTitle;
  document.getElementById('hero-subtitle').innerText = translations.heroSubtitle;
  document.getElementById('hero-benefits').innerHTML = translations.heroBenefits.map(b => `<p>${b}</p>`).join('');
  document.getElementById('start-trial').innerText = translations.startTrial;
  document.getElementById('platforms-title').innerText = translations.platformsTitle;
  document.getElementById('subscription-title').innerText = translations.subscription.title;
  document.getElementById('email-input').placeholder = translations.subscription.placeholder;
  document.getElementById('subscribe-button').innerText = translations.subscription.button;
  document.getElementById('subscription-note').innerText = translations.subscription.note;
  document.getElementById('about-title').innerText = translations.about.title;
  document.getElementById('about-content').innerText = translations.about.content;
}

// ====== Language Switcher ======
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('language-switcher').addEventListener('change', (e) => {
    loadLanguage(e.target.value);
  });

  loadLanguage(currentLang); // initial load
});

// ====== Active User Counter ======
let activeUsers = 2697;
const activeUsersElement = document.getElementById('active-users');

function updateActiveUsers() {
  if (translations.subscription && translations.subscription.count) {
    activeUsersElement.innerText = translations.subscription.count.replace('{count}', activeUsers);
  } else {
    activeUsersElement.innerText = `🎯 ${activeUsers} Active Users`;
  }
}

// ====== Subscription API Integration ======
const API_URL = 'https://script.google.com/macros/s/AKfycbwLhNRd5GsFRf7l9zrHANAg30W1mzvusjIZaXeJptO932cVNWmiIlcnCu8NYKz00X3u/exec';


function subscribeUser(email) {
  fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      if (data.result === 'success') {
        alert('✅ Thanks for subscribing! Check your email.');
        document.getElementById('email-input').value = '';
        activeUsers++;
        updateActiveUsers();
      } else {
        alert('⚠️ Something went wrong.');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('⚡ Server error. Try again.');
    });
}

// ====== Form Submission Handler ======
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('subscribe-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (email) {
      subscribeUser(email);
    } else {
      alert('⚠️ Please enter a valid email address.');
    }
  });
});
