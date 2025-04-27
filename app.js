let actualSubscribers = 2697;

function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('title').innerText = data.hero.title;
      document.getElementById('tagline').innerText = data.hero.tagline;
      document.getElementById('services-title').innerText = data.services.title;
      document.getElementById('start-trial-title').innerText = data.subscription.title;
      document.getElementById('email').placeholder = data.subscription.placeholder;
      document.getElementById('subscribe-button').innerText = data.subscription.button;
      document.getElementById('subscription-note').innerText = data.subscription.note;
      document.getElementById('subscription-count').innerText = data.subscription.count.replace('{count}', actualSubscribers);
      document.getElementById('platforms-title').innerText = data.platforms.title;
      document.getElementById('about-title').innerText = data.about.title;
      document.getElementById('about-content').innerText = data.about.content;

      document.getElementById('services-list').innerHTML = data.services.items
        .map(item => `<li>${item}</li>`)
        .join('');
    });
}

document.getElementById('language-selector').addEventListener('change', (e) => {
  loadLanguage(e.target.value);
});

loadLanguage('en'); // Default language

// Subscriber counter increases every 15 seconds
setInterval(() => {
  actualSubscribers++;
  const lang = document.getElementById('language-selector').value;
  loadLanguage(lang);
}, 15000);
