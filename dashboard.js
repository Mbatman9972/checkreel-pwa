import { getUserPlan, getPlanLimit, remainingQuota } from "./tier.js";

/* Init quota badge */
const quotaBar = document.getElementById("quotaBar");

function renderQuota() {
  const used = Number(localStorage.getItem("scanCount")) || 0;
  const plan = getUserPlan();
  const limit = getPlanLimit(plan);
  const remaining = remainingQuota(used);

  quotaBar.textContent =
    plan === "plus"
      ? "Plus · 40 scans"
      : plan === "premium"
      ? "Premium · 20 scans"
      : `Free · ${remaining} ${remaining === 1 ? "scan" : "scans"} left`;
}

renderQuota();

/* Platform selector */
let platform = "";
document.getElementById("platforms").addEventListener("click", e => {
  if (!e.target.classList.contains("platform")) return;
  document.querySelectorAll(".platform").forEach(b => b.classList.remove("selected"));
  e.target.classList.add("selected");
  platform = e.target.id;
});

/* Region selector */
let region = "";
document.getElementById("regions").addEventListener("change", e => {
  if (e.target.name === "region") region = e.target.value;
});

/* File label update */
const fileInput = document.getElementById("fileInput");
const fileTxt = document.getElementById("fileLabelText");
fileInput.onchange = () => {
  fileTxt.textContent = fileInput.files[0]?.name || "Choose a file…";
};

/* Scan button */
const historyUl = document.getElementById("history");
document.getElementById("scanBtn").onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Choose a file first");
  if (!platform) return alert("Please select a platform");
  if (!region) return alert("Please select a region");

  try {
    const res = await fetch('/scan/check', {
      method: 'GET',
      headers: {
        'x-user-plan': getUserPlan()
      }
    });

    const text = await res.text();
    const result = JSON.parse(text);

    if (result.error) {
      showUpgrade();
      return;
    }
  } catch (err) {
    alert("Could not verify scan quota. Please try again.");
    return;
  }

  renderQuota();

  const li = document.createElement("li");
  const icon = new Image();
  icon.src = `images/platform-logos/${platform}.png`;
  icon.alt = platform;
  icon.style.width = "22px";
  icon.style.height = "22px";

  li.append(
    icon,
    document.createTextNode(
      `  ${file.name} ✓ [${platform.toUpperCase()} · ${region.toUpperCase()}]  —  ${new Date().toLocaleTimeString()}`
    )
  );
  historyUl.prepend(li);

  fileInput.value = "";
  fileTxt.textContent = "Choose a file…";
};

/* Upgrade modal actions */
const modal = document.getElementById("upgradeModal");
function showUpgrade() {
  modal.classList.remove("hidden");
}
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
document.getElementById("goUpgrade").onclick = () => {
  window.open("https://www.alwaferr.com/payment/checkreel-premium", "_blank");
};
