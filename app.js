// Initialize translations variable
let translations = {};

// Load translations from the selected language file
function loadTranslations(language) {
  fetch(`./lang/${language}.json`)
    .then(response => response.json())
    .then(data => {
      translations = data;
      updateContent();
    });
}

// Update content based on the loaded translations
function updateContent() {
  // Hero Section
  document.getElementById('hero-title').innerText = translations['hero_title'];
  document.getElementById('hero-subtitle').innerText = translations['hero_subtitle'];
  document.getElementById('start-trial').innerText = translations['start_trial'];

  // Hero Benefits
  const benefits = document.querySelectorAll('.benefit');
  benefits[0].innerText = translations['benefit_1'];
  benefits[1].innerText = translations['benefit_2'];
  benefits[2].innerText = translations['benefit_3'];
  benefits[3].innerText = translations['benefit_4'];

  // Platforms Section
  document.getElementById('platforms-title').innerText = translations['platforms_title'];
  const platformList = document.querySelector('.platform-list');
  platformList.innerHTML = translations['platforms_list'].map(p => `<span>${p}</span>`).join('');
}

// Set up the language switcher event listener
document.getElementById('language-switcher').addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;  // Get selected language from dropdown
  loadTranslations(selectedLanguage);
});

// Load default language (English)
loadTranslations('en');  // Default to English language
