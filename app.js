/************************************************************
 *  Checkreel front-end script
 *  – registers RTL if Arabic
 *  – posts subscription e-mail to Google Apps Script backend
 ************************************************************/

// 1️⃣  RTL / LTR handling
console.log("Checkreel Mobile App Loaded.");
if (document.documentElement.lang === "ar") {
  document.body.style.direction = "rtl";
} else {
  document.body.style.direction = "ltr";
}

// 2️⃣  Subscription form → Google Apps Script
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("subscription-form");
  if (!form) return; // safety

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.elements["email"].value.trim();
    if (!email) return alert("Please enter an e-mail address.");

    const endpointUrl =
      "YOUR_SCRIPT_URL"; // <-- replace this entire string with the /exec URL

    fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, action: "subscribe" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          alert("Subscription successful! Check your e-mail for confirmation.");
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
