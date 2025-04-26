const languageSelect = document.getElementById('language-select');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroBenefits = document.getElementById('hero-benefits');
const startTrial = document.getElementById('start-trial');
const services = [
  { title: document.getElementById('service-1-title'), desc: document.getElementById('service-1-desc') },
  { title: document.getElementById('service-2-title'), desc: document.getElementById('service-2-desc') },
  { title: document.getElementById('service-3-title'), desc: document.getElementById('service-3-desc') }
];
const subscriptionTitle = document.getElementById('subscription-title');
const emailInput = document.getElementById('email-input');
const subscribeButton = document.getElementById('subscribe-button');
const subscriptionNote = document.getElementById('subscription-note');
const activeUsers = document.getElementById('active-users');
const platformsTitle = document.getElementById('platforms-title');
const platformsList = document.getElementById('platforms-list');
const aboutTitle = document.getElementById('about-title');
const aboutContent = document.getElementById('about-content');

let subscriberCount = 2697;

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  const translations = await res.json();

  heroTitle.innerText = translations.heroTitle;
  heroSubtitle.innerText = translations.heroSubtitle;
  heroBenefits.innerHTML = translations.heroBenefits.map(b => `<li>${b}</li>`).join('');
  startTrial.innerText = translations.startTrial;

  services[0].title.innerText = translations.services["1"][0];
  services[0].desc.innerText = translations.services["1"][1];
  services[1].title.innerText = translations.services["2"][0];
  services[1].desc.innerText = translations.services["2"][1];
  services[2].title.innerText = translations.services["3"][0];
  services[2].desc.innerText = translations.services["3"][1];

  subscriptionTitle.innerText = translations.subscription.title;
  emailInput.placeholder = translations.subscription.placeholder;
  subscribeButton.innerText = translations.subscription.button;
  subscriptionNote.innerText = translations.subscription.note;
  activeUsers.innerText = translations.subscription.count.replace('{count}', subscriberCount);

  platformsTitle.innerText = translations.platforms.title;
  platformsList.innerHTML = translations.platforms.list.map(platform => `
    <div class="platform-card">
      <img src="images/platform-logos/${platform.logo}" alt="${platform.name}">
      <span>${platform.name}</span>
    </div>
  `).join('');

  aboutTitle.innerText = translations.about.title;
  aboutContent.innerText = translations.about.content;
}

languageSelect.addEventListener('change', () => {
  loadLanguage(languageSelect.value);
});

loadLanguage('en');
