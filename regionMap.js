const regionData = {
  mena: {
    map: "🗺️ MENA Region",
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Egypt", "Jordan", "Kuwait", "Morocco"]
  },
  us: {
    map: "🗺️ United States of America",
    countries: ["USA"]
  },
  eu: {
    map: "🗺️ European Union",
    countries: ["Germany", "France", "Italy", "Spain", "Netherlands", "Sweden"]
  },
  global: {
    map: "🌍 Worldwide",
    countries: ["All major regions included."]
  },
  me: {
    map: "🗺️ Middle East",
    countries: ["Bahrain", "Oman", "Iraq", "Lebanon", "Syria", "Palestine", "Yemen"]
  }
};

function renderMap(regionKey) {
  const mapEl = document.getElementById("regionMap");
  const countriesEl = document.getElementById("countryList");

  if (!mapEl || !countriesEl) return;

  const region = regionData[regionKey];
  if (!region) return;

  mapEl.innerHTML = `<p>${region.map}</p>`;
  countriesEl.innerHTML = `<strong>Countries:</strong> ${region.countries.join(", ")}`;
}

document.getElementById("regions").addEventListener("change", (e) => {
  if (e.target.name === "region") {
    renderMap(e.target.value);
  }
});

// render default on load
document.addEventListener("DOMContentLoaded", () => {
  const defaultRegion = document.querySelector('input[name="region"]:checked')?.value || "mena";
  renderMap(defaultRegion);
});
