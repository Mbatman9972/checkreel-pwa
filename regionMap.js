const regionMap = {
  mena: {
    name: "MENA 🌍",
    countries: [
      "Algeria", "Bahrain", "Egypt", "Iraq", "Jordan", "Kuwait",
      "Lebanon", "Libya", "Mauritania", "Morocco", "Oman", "Palestine",
      "Qatar", "Saudi Arabia", "Sudan", "Syria", "Tunisia", "UAE", "Yemen"
    ]
  },
  us: {
    name: "United States of America 🇺🇸",
    countries: ["USA"]
  },
  eu: {
    name: "European Union 🇪🇺",
    countries: [
      "Germany", "France", "Italy", "Spain", "Netherlands", "Poland",
      "Sweden", "Greece", "Denmark", "Finland", "Portugal", "Belgium"
    ]
  },
  global: {
    name: "Worldwide 🌐",
    countries: ["All major regions included."]
  },
  me: {
    name: "Middle East 🕌",
    countries: [
      "Bahrain", "Oman", "Iraq", "Lebanon", "Syria", "Palestine", "Yemen"
    ]
  }
};

function renderMap(region) {
  const mapEl = document.getElementById("regionMap");
  const countryEl = document.getElementById("countryList");

  if (!mapEl || !countryEl) return;

  const data = regionMap[region];
  if (!data) return;

  const lang = document.documentElement.lang;
  const isRTL = document.documentElement.dir === "rtl";

  mapEl.textContent = data.name;
  countryEl.innerHTML = `<strong>${isRTL ? "الدول:" : "Countries:"}</strong> ${data.countries.join(", ")}`;
}

document.getElementById("regions").addEventListener("change", e => {
  if (e.target.name === "region") {
    renderMap(e.target.value);
  }
});

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  const selected = document.querySelector('input[name="region"]:checked');
  if (selected) renderMap(selected.value);
});
