// ========== REGION MAP LOGIC ==========

// Region Definitions
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

// Load language preference from sessionStorage
let currentLang = sessionStorage.getItem("lang") || "en";

// Fetch translations and then render
let translations = {};
fetch(`lang/${currentLang}.json`)
  .then(res => res.json())
  .then(data => {
    translations = data;
    renderRegions();
  });

function txt(path, fallback = "") {
  const parts = path.split(".");
  let val = translations;
  for (const part of parts) {
    if (val && part in val) {
      val = val[part];
    } else {
      return fallback;
    }
  }
  return val;
}

function renderRegions() {
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

    btn.appendChild(icon);
    btn.appendChild(label);

    btn.addEventListener("click", () => handleRegionClick(region));
    regionButtonsContainer.appendChild(btn);
  });
}

function handleRegionClick(region) {
  document.querySelectorAll(".region-button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelector(`#btn-${region.id}`).classList.add("active");

  if (region.countries.length > 0) {
    countryListContainer.innerHTML = region.countries.join(" • ");
  } else {
    countryListContainer.innerHTML = "";
  }
}
