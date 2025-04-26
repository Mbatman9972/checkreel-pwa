const langSelect = document.getElementById("languageSelect");
let translations = {};
let currentLang = "en";

// Load JSON file based on selected language
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      updateContent();
    });
}

// Update page content dynamically
function updateContent() {
  document.getElementById("hero-title").innerText = translations.heroTitle;
  document.getElementById("hero-subtitle").innerText = translations.heroSubtitle;

  const benefits = document.getElementById("hero-benefits");
  benefits.innerHTML = "";
  translations.heroBenefits.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    benefits.appendChild(li);
  });

  document.getElementById("start-trial").innerText = translations.startTrial;

  // Services
  document.getElementById("service-1-title").innerText = translations.services["1"][0];
  document.getElementById("service-1-desc").innerText = translations.services["1"][1];
  document.getElementById("service-2-title").innerText = translations.services["2"][0];
  document.getElementById("service-2-desc").innerText = translations.services["2"][1];
  document.getElementById("service-3-title").innerText = translations.services["3"][0];
  document.getElementById("service-3-desc").innerText = translations.services["3"][1];

  // Subscription
  document.getElementById("sub-title").innerText = translations.subscription.title;
  document.getElementById("email-input").placeholder = translations.subscription.placeholder;
  document.getElementById("subscribe-btn").innerText = translations.subscription.button;
  document.getElementById("pricing-note").innerText = translations.subscription.note;

  const fakeCount = 2697;
  document.getElementById("user-count").innerText = translations.subscription.count.replace("{count}", fakeCount);

  // About section
  document.getElementById("about-title").innerText = translations.about.title;
  document.getElementById("about-content").innerText = translations.about.content;

  // Platform section
  document.getElementById("platforms-title").innerText = translations.platforms.title;
  const platformHTML = translations.platforms.items.map(
    (p) => `
      <div class="platform">
        <img src="${p.logo}" alt="${p.name}" />
        <div>${p.name}</div>
      </div>`
  ).join('');
  document.querySelector(".platform-list").innerHTML = platformHTML;
}

// Language change
langSelect.addEventListener("change", () => {
  currentLang = langSelect.value;
  loadLanguage(currentLang);
});

// Load default language
loadLanguage(currentLang);
