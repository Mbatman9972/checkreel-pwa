// regionMap.js · CheckReel
document.addEventListener("DOMContentLoaded", () => {
  const regionContainer = document.querySelector(".region-buttons");
  const countryList = document.querySelector(".country-list");

  const regions = [
    {
      id: "middle-east",
      label: "Middle East",
      countries: [
        "🇸🇦 Saudi Arabia", "🇦🇪 UAE", "🇶🇦 Qatar", "🇰🇼 Kuwait",
        "🇧🇭 Bahrain", "🇴🇲 Oman", "🇱🇧 Lebanon", "🇯🇴 Jordan", "🇮🇶 Iraq"
      ]
    },
    {
      id: "mena",
      label: "MENA",
      countries: [
        "🇲🇦 Morocco", "🇩🇿 Algeria", "🇹🇳 Tunisia", "🇪🇬 Egypt",
        "🇸🇩 Sudan", "🇱🇾 Libya", "🇵🇸 Palestine", "🇸🇾 Syria", "🇾🇪 Yemen"
      ]
    },
    {
      id: "europe",
      label: "Europe",
      countries: [
        "🇫🇷 France", "🇩🇪 Germany", "🇮🇹 Italy", "🇪🇸 Spain", "🇬🇧 UK", "🇵🇹 Portugal",
        "🇧🇪 Belgium", "🇳🇱 Netherlands", "🇸🇪 Sweden", "🇳🇴 Norway", "🇩🇰 Denmark",
        "🇫🇮 Finland", "🇦🇹 Austria", "🇨🇭 Switzerland", "🇵🇱 Poland", "🇨🇿 Czechia",
        "🇭🇺 Hungary", "🇷🇴 Romania", "🇧🇬 Bulgaria", "🇬🇷 Greece", "🇮🇪 Ireland",
        "🇸🇰 Slovakia", "🇸🇮 Slovenia", "🇭🇷 Croatia", "🇱🇹 Lithuania", "🇱🇻 Latvia",
        "🇪🇪 Estonia", "🇲🇹 Malta", "🇨🇾 Cyprus", "🇱🇺 Luxembourg"
      ]
    },
    {
      id: "global",
      label: "Global",
      countries: []
    }
  ];

  function renderRegions() {
    regions.forEach(region => {
      const btn = document.createElement("button");
      btn.className = "region";
      btn.dataset.region = region.id;
      btn.innerHTML = `<img src="images/region-icons/${region.id}.png" alt="${region.label}" /> ${region.label}`;
      btn.onclick = () => {
        document.querySelectorAll(".region").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        renderCountries(region.countries);
      };
      regionContainer.appendChild(btn);
    });
  }

  function renderCountries(countries) {
    countryList.innerHTML = "";
    if (!countries.length) return;
    countries.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c;
      countryList.appendChild(li);
    });
  }

  renderRegions();
});
