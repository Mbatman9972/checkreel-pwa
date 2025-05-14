// regionMap.js

const regionMap = document.getElementById("regionMap");
const countryList = document.getElementById("countryList");

const regionData = {
  mena: {
    name: "MENA 🌍",
    countries: [
      "Algeria", "Bahrain", "Egypt", "Iran", "Iraq", "Israel", "Jordan",
      "Kuwait", "Lebanon", "Libya", "Morocco", "Oman", "Palestine",
      "Qatar", "Saudi Arabia", "Syria", "Tunisia", "UAE", "Yemen",
      "Sudan", "Mauritania", "Djibouti", "Somalia"
    ]
  },
  eu: {
    name: "European Union 🇪🇺",
    countries: [
      "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
      "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland",
      "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia",
      "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro",
      "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia",
      "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland",
      "Ukraine", "United Kingdom", "Vatican City"
    ]
  },
  me: {
    name: "Middle East 🕌",
    countries: [
      "Bahrain", "Egypt", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon",
      "Oman", "Palestine", "Qatar", "Saudi Arabia", "Syria", "Turkey", "UAE", "Yemen",
      "Cyprus", "Azerbaijan", "Armenia", "Georgia"
    ]
  },
  us: {
    name: "United States of America 🇺🇸",
    countries: ["USA"]
  }
};

// Auto update region info
document.getElementById("regions").addEventListener("change", e => {
  if (e.target.name !== "region") return;

  const val = e.target.value;
  const selected = regionData[val];

  if (!selected) {
    regionMap.innerHTML = "";
    countryList.innerHTML = "";
    return;
  }

  regionMap.innerHTML = `<strong>${selected.name}</strong> <img src="images/region-placeholder.png" alt="${selected.name}" style="height:1em; vertical-align:middle;" />`;
  countryList.innerHTML = `<strong>Countries:</strong> ${selected.countries.join(", ")}`;
});
