/************************************************************
 *  Checkreel front-end script
 ************************************************************/

/* RTL / LTR */
console.log("Checkreel Mobile App Loaded.");
document.body.style.direction =
  document.documentElement.lang === "ar" ? "rtl" : "ltr";

/* Subscription form */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("subscription-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.elements["email"].value.trim();
    if (!email) {
      alert("Please enter an e-mail address.");
      return;
    }

    /* LIVE Apps Script endpoint (leave /exec at the end!) */
    const endpoint =
      "https://script.google.com/macros/s/AKfycbwImj66Iz5a8FAB7n-jD-gQ5BF6MMrxBVSiPn-g_uwbGJEmVPQKXPErjMEigcH6Qrpp/exec";

    /* Build a query-string URL – no CORS pre-flight */
    const url =
      endpoint +
      "?action=subscribe&email=" +
      encodeURIComponent(email);

    fetch(url) // default is GET
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
