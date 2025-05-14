const regionCountryMap = {
  mena: ["UAE", "Saudi Arabia", "Qatar", "Egypt", "Jordan", "Morocco"],
  europe: ["France", "Germany", "Spain", "Italy", "UK", "Sweden"],
  asia: ["India", "Japan", "South Korea", "Indonesia", "Vietnam"],
  americas: ["USA", "Canada", "Brazil", "Mexico", "Argentina"]
};

const mapContainer = document.getElementById("regionMap");
const countryList = document.getElementById("countryList");

document.getElementById("regions").addEventListener("change", (e) => {
  if (e.target.name !== "region") return;

  const selected = e.target.value;
  renderMap(selected);
  renderCountries(selected);
});

function renderMap(region) {
  mapContainer.innerHTML = `<div class="map zoom">${region.toUpperCase()} Map</div>`;
}

function renderCountries(region) {
  const countries = regionCountryMap[region] || [];
  countryList.innerHTML = countries
    .map(
      (country) =>
        `<label><input type="checkbox" checked /> ${country}</label>`
    )
    .join("");
}
