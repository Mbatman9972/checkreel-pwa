// ✅ CheckReel Frontend Script – Phase A

// 1️⃣ Set up reCAPTCHA v3 on load
window.onload = function () {
    grecaptcha.ready(() => {
      grecaptcha.execute("6LfveSIrAAAA", { action: "subscribe" }).then((token) => {
        document.getElementById("recaptcha-token").value = token;
      });
    });
  
    // 2️⃣ Fetch Active Subscriber Count
    fetch("https://script.google.com/macros/s/AKfycbzznyXR05SYR0K0B8hpRza9cyFwHywjuiUudGJofJDoBYR3WZ0LYS5NoB3FiiLxEB4/exec?action=stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.count !== undefined) {
          document.getElementById("subs-count").textContent = data.count.toLocaleString();
        }
      })
      .catch(() => {
        document.getElementById("subs-count").textContent = "—";
      });
  };
  
  // 3️⃣ Handle subscription form submit
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("subscription-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.elements["email"].value.trim();
      const token = this.elements["recaptcha"].value;
  
      if (!email || !token) return alert("Missing data, try again.");
  
      const url = "https://script.google.com/macros/s/AKfycbzznyXR05SYR0K0B8hpRza9cyFwHywjuiUudGJofJDoBYR3WZ0LYS5NoB3FiiLxEB4/exec";
  
      fetch(`${url}?email=${encodeURIComponent(email)}&action=subscribe&token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result === "success") {
            alert("🎉 You're subscribed! Check your inbox.");
            form.reset();
          } else {
            alert("❌ Error: " + (data.message || "Something went wrong"));
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Network error. Please try again.");
        });
    });
  });
  