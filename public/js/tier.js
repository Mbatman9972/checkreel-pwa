// tier.js · CheckReel
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("planSelect");
  const quota = document.getElementById("quotaBar");

  const plans = {
    free: { scans: 3, label: "Free · 3 scans left" },
    plus: { scans: 50, label: "Plus · 50 scans" },
    premium: { scans: "∞", label: "Premium · Unlimited scans" }
  };

  function updateQuota() {
    const val = select.value;
    quota.textContent = plans[val]?.label || plans.free.label;
  }

  if (select && quota) {
    updateQuota();
    select.onchange = updateQuota;
  }
});
