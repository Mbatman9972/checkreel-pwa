/* dashboard.js  – main logic for scan page */
import { getTier, decrementQuota } from "./tier.js";

/* ------------------------------------------------------------------ */
/* init tier badge */
const quotaBar = document.getElementById("quotaBar");
function renderQuota() {
  const t = getTier();
  quotaBar.textContent =
    t.name === "plus"
      ? "Plus · Unlimited scans"
      : `${t.name.charAt(0).toUpperCase() + t.name.slice(1)} · ${t.quota} ${t.quota === 1 ? "scan" : "scans"} left`;
}
renderQuota();

/* ------------------------------------------------------------------ */
/* platform selector */
let platform = "facebook";
document.getElementById("platforms").addEventListener("click", e => {
  if (!e.target.classList.contains("platform")) return;
  document.querySelectorAll(".platform").forEach(b => b.classList.remove("selected"));
  e.target.classList.add("selected");
  platform = e.target.id;
});

/* ------------------------------------------------------------------ */
/* region selector */
let region = "mena";
document.getElementById("regions").addEventListener("change", e => {
  if (e.target.name === "region") region = e.target.value;
});

/* ------------------------------------------------------------------ */
/* file label update */
const fileInput = document.getElementById("fileInput");
const fileTxt   = document.getElementById("fileLabelText");
fileInput.onchange = () => {
  fileTxt.textContent = fileInput.files[0]?.name || "Choose a file…";
};

/* ------------------------------------------------------------------ */
/* scan button */
const historyUl = document.getElementById("history");
document.getElementById("scanBtn").onclick = () => {
  const file = fileInput.files[0];
  if (!file) return alert("Choose a file first");

  /* check quota */
  if (!decrementQuota()) {
    showUpgrade();
    return;
  }
  renderQuota();

  /* add to history */
  const li   = document.createElement("li");
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

  /* reset input */
  fileInput.value = "";
  fileTxt.textContent = "Choose a file…";
};

/* ------------------------------------------------------------------ */
/* upgrade modal actions */
const modal = document.getElementById("upgradeModal");
function showUpgrade() { modal.classList.remove("hidden"); }
document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
document.getElementById("goUpgrade").onclick = () => {
  // TODO: replace with your real payment link
  window.open("https://www.alwaferr.com/payment/checkreel-premium", "_blank");
};
