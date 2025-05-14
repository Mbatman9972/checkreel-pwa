const regionMap = {
  mena: {
    name: "MENA 🌍",
    countries: [
      "Algeria", "Bahrain", "Egypt", "Iran", "Iraq", "Jordan",
      "Kuwait", "Lebanon", "Libya", "Mauritania", "Morocco", "Oman",
      "Palestine", "Qatar", "Saudi Arabia", "Somalia", "Sudan", "Syria",
      "Tunisia", "UAE", "Yemen", "Djibouti"
    ]
  },
  me: {
    name: "Middle East 🌍",
    countries: [
      "Bahrain", "Egypt", "Iran", "Iraq", "Palestine", "Jordan",
      "Kuwait", "Lebanon", "Oman", "Qatar", "Saudi Arabia", "Syria",
      "Turkey", "UAE", "Yemen", "Cyprus", "Azerbaijan", "Armenia", "Georgia"
    ]
  },
  eu: {
    name: "Europe 🌍",
    countries: [
      "Germany", "France", "Italy", "Spain", "Netherlands", "Sweden", "Belgium", "Poland",
      "Portugal", "Austria", "Greece", "Romania", "Hungary", "Czech Republic", "Finland", "Denmark",
      "Norway", "Ireland", "Croatia", "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania",
      "Bulgaria", "Luxembourg", "Malta", "Cyprus", "Iceland", "Liechtenstein", "Monaco", "San Marino",
      "Vatican City", "Albania", "Serbia", "Bosnia and Herzegovina", "Macedonia", "Montenegro", "Moldova",
      "Belarus", "Ukraine", "Russia"
    ]
  },
  global: {
    name: "Worldwide 🌐",
    countries: []
  }
};

const mapBox = document.querySelector(".region-map");
const listBox = document.querySelector(".country-list");

document.getElementById("regions").addEventListener("change", e => {
  if (e.target.name !== "region") return;

  const val = e.target.value;
  const data = regionMap[val];

  if (data) {
    mapBox.innerHTML = `<div style="margin-bottom: 0.5rem; font-weight: bold;">${data.name}</div>`;
    listBox.innerHTML = data.countries.length
      ? `<strong>Countries:</strong><br>${data.countries.join(", ")}`
      : `<strong>Countries:</strong><br>All major regions included.`;
  }
});
