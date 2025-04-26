const subscriberStartCount = 2697;
let actualSubscribers = subscriberStartCount;

// Load default language
let currentLang = 'en';
loadLanguage(currentLang);

// Language switcher
document.getElementById('language-select').addEventListener('change', function() {
  currentLang = this.value;
  loadLanguage(currentLang);
});

// Load translations
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('hero-title').innerText = data.heroTitle;
      document.getElementById('hero-subtitle').innerText = data.heroSubtitle;

      const benefitsContainer = document.getElementById('benefits');
      benefitsContainer.innerHTML = "";
      data.heroBenefits.forEach(benefit => {
        const div = document.createElement('div');
        div.innerText = benefit;
        benefitsContainer.appendChild(div);
      });

      document.getElementById('start-trial').innerText = data.startTrial;
      document.getElementById('services-title').innerText = data.servicesTitle;
      
      const serviceList = document.getElementById('service-list');
      serviceList.innerHTML = "";
      Object.values(data.services).forEach(service => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${service[0]}</strong><br>${service[1]}`;
        serviceList.appendChild(div);
      });

      document.getElementById('subscription-title').innerText = data.subscription.title;
      document.getElementById('email').placeholder = data.subscription.placeholder;
      document.getElementById('subscribe-button').innerText = data.subscription.button;
      document.getElementById('subscription-note').innerText = data.subscription.note;
      document.getElementById('subscription-count').innerText = data.subscription.count.replace('{count}', actualSubscribers);

      document.getElementById('about-title').innerText = data.about.title;
      document.getElementById('about-content').innerText = data.about.content;
    });
}

// Simulate a new paying subscriber every 15 seconds (demo purpose)
setInterval(() => {
  actualSubscribers++;
  document.getElementById('subscription-count').innerText = document.getElementById('subscription-count').innerText.replace(/\d+/, actualSubscribers);
}, 15000);
