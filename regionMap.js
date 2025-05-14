// ========== REGION MAP LOGIC ==========

const regions = [
  {
    id: "middle-east",
    key: "regionMiddleEast",
    icon: "images/region-icons/middle-east.png",
    countries: [
      "Jordan", "Saudi Arabia", "Qatar", "UAE", "Kuwait", "Bahrain",
      "Oman", "Iraq", "Lebanon", "Syria", "Palestine", "Yemen"
    ]
  },
  {
    id: "mena",
    key: "regionMENA",
    icon: "images/region-icons/mena.png",
    countries: [
      "Jordan", "Saudi Arabia", "Qatar", "UAE", "Kuwait", "Bahrain", "Oman", "Iraq",
      "Lebanon", "Syria", "Palestine", "Yemen", "Egypt", "Algeria", "Tunisia",
      "Morocco", "Libya", "Mauritania", "Sudan"
    ]
  },
  {
    id: "europe",
    key: "regionEurope",
    icon: "images/region-icons/europe.png",
    countries: [
      "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina",
      "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
      "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo",
      "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro",
      "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia",
      "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland"
    ]
  },
  {
    id: "global",
    key: "regionGlobal",
    icon: "images/region-icons/global.png",
    countries: []
  }
];

const regionButtonsContainer = document.querySelector(".region-buttons");
const countryListContainer = document.querySelector(".country-list");

// Load language preference
const currentLang = sessionStorage.getItem("lang") || "en";
let translations = {};

// Load translations and render buttons
fetch(`lang/${currentLang}.json`)
  .then(res => res.json())
  .then(data => {
    translations = data;
    renderRegions();
  });

function txt(path, fallback = "") {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : fallback), translations);
}

function renderRegions() {
  if (!regionButtonsContainer) return;
  regionButtonsContainer.innerHTML = "";

  regions.forEach(region => {
    const btn = document.createElement("button");
    btn.className = "region-button";
    btn.id = `btn-${region.id}`;

    const icon = document.createElement("img");
    icon.src = region.icon;
    icon.alt = region.id;

    const label = document.createElement("span");
    label.textContent = txt(`regions.${region.key}`, region.id);

    btn.append(icon, label);

    btn.addEventListener("click", () => handleRegionClick(region));
    regionButtonsContainer.appendChild(btn);
  });
}

function handleRegionClick(region) {
  document.querySelectorAll(".region-button").forEach(btn =>
    btn.classList.remove("active")
  );
  const selectedBtn = document.querySelector(`#btn-${region.id}`);
  if (selectedBtn) selectedBtn.classList.add("active");

  if (countryListContainer) {
    countryListContainer.innerHTML = region.countries.length > 0
      ? region.countries.join(" • ")
      : "";
  }

  // ✅ Set global region for other scripts
  window.region = region.id;
}
