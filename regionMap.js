const mapImg = document.getElementById("regionMap");
const countryList = document.getElementById("countryList");

const regionData = {
  mena: {
    map: "images/world-plain.png",
    name: "MENA 🌍",
    countries: [
      "Algeria", "Bahrain", "Egypt", "Iran", "Iraq", "Palestine", "Jordan",
      "Kuwait", "Lebanon", "Libya", "Morocco", "Oman", "Palestine",
      "Qatar", "Saudi Arabia", "Syria", "Tunisia", "UAE", "Yemen",
      "Sudan", "Mauritania", "Djibouti", "Somalia"
    ]
  },
  us: {
    map: "images/world-plain.png",
    name: "United States of America 🗽",
    countries: ["USA"]
  },
  eu: {
    map: "images/world-plain.png",
    name: "European Union 📘",
    countries: [
      "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia",
      "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
      "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
      "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal",
      "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland",
      "Ukraine", "United Kingdom", "Vatican City"
    ]
  },
  me: {
    map: "images/world-plain.png",
    name: "Middle East 🌍",
    countries: [
      "Bahrain", "Egypt", "Iran", "Iraq", "Palestine", "Jordan", "Kuwait", "Lebanon", "Oman", "Qatar",
      "Saudi Arabia", "Syria", "Turkey", "UAE", "Yemen", "Cyprus", "Azerbaijan", "Armenia", "Georgia"
    ]
  }
};

// Handle change
document.getElementById("regions").addEventListener("change", e => {
  if (e.target.name !== "region") return;
  const region = e.target.value;
  renderMap(region);
});

function renderMap(region) {
  const data = regionData[region];
  if (!data) return;

  mapImg.innerHTML = `<img src="${data.map}" alt="${region}" width="400" height="200" /><br><strong>${data.name}</strong>`;
  countryList.innerHTML = `<strong>Countries:</strong><br>${data.countries.join(", ")}`;
}
