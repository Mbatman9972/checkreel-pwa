// dashboard.js · CheckReel v1.0
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileLabel = document.getElementById("fileLabelText");
  const scanBtn = document.getElementById("scanBtn");
  const historyList = document.getElementById("history");

  fileInput.onchange = () => {
    const name = fileInput.files[0]?.name || "";
    fileLabel.textContent = name ? `📎 ${name}` : "Choose a file…";
  };

  scanBtn.onclick = () => {
    const file = fileInput.files[0];
    if (!file) return alert("Please choose a file to scan.");

    const platform = document.querySelector(".platform.selected")?.id;
    const region = document.querySelector(".region.selected")?.dataset.region;

    if (!platform || !region) {
      return alert("Please select both platform and region.");
    }

    const timestamp = new Date().toLocaleString();
    const result = `✔️ ${file.name} · ${platform} · ${region} · ${timestamp}`;

    const li = document.createElement("li");
    li.textContent = result;
    historyList.prepend(li);

    alert("✅ Scan completed! (mock)");
  };

  document.querySelectorAll(".platform").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".platform").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
  });
});
