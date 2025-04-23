/************************************************************
 *  Checkreel front-end script
 *  – sets RTL if Arabic
 *  – posts subscription e-mail to Google Apps Script backend
 ************************************************************/

/* ---------- 1  RTL / LTR handling ---------- */
console.log("Checkreel Mobile App Loaded.");
if (document.documentElement.lang === "ar") {
  document.body.style.direction = "rtl";
} else {
  document.body.style.direction = "ltr";
}

/* ---------- 2  Subscription form ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("subscription-form");
  if (!form) return; // safety guard

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.elements["email"].value.trim();
    if (!email) {
      alert("Please enter an e-mail address.");
      return;
    }

    // 🔗  LIVE Apps Script endpoint (ends in /exec)
    const endpointUrl =
      "https://script.google.com/macros/s/AKfycbwImj66Iz5a8FAB7n-jD-gQ5BF6MMrxBVSiPn-g_uwbGJEmVPQKXPErjMEigcH6Qrpp/exec";

    fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, action: "subscribe" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          alert(
            "Subscription successful! Check your e-mail for confirmation."
          );
          form.reset();
        } else {
          alert("Backend error: " + (data.message || "unknown"));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Network error. Please try again.");
      });
  });
});
