/************************************************************
 *  Checkreel front-end script
 *  – Language switching (en, fr, ar)
 *  – RTL if Arabic
 *  – Posts subscription to Google Apps Script
 ************************************************************/

// 🌐 ملفات الترجمة
const translations = {
  en: 'lang-en.json',
  fr: 'lang-fr.json',
  ar: 'lang-ar.json'
};

// 🔁 تفعيل RTL للعربية
if (document.documentElement.lang === "ar") {
  document.body.style.direction = "rtl";
} else {
  document.body.style.direction = "ltr";
}

// 📌 تحميل الترجمة وتطبيقها
function applyTranslations(lang) {
  const file = translations[lang];
  if (!file) return;

  fetch(file)
    .then(res => res.json())
    .then(data => {
      document.querySelector('.hero-title').textContent = data.hero_title;
      document.querySelector('.hero-subtitle').textContent = data.hero_subtitle;
      const listItems = document.querySelectorAll('.hero-benefits li');
      listItems[0].textContent = data.benefits[0];
      listItems[1].textContent = data.benefits[1];
      listItems[2].textContent = data.benefits[2];
      listItems[3].textContent = data.benefits[3];

      document.querySelector('.cta-button').textContent = data.cta_button;
      document.querySelector('.subscription-content h2').textContent = data.subscribe_title;
      document.querySelector('#subscription-form input[type="email"]').placeholder = data.email_placeholder;
      document.querySelector('#subscription-form button').textContent = data.subscribe_button;
      document.querySelector('.price-note').textContent = data.price_note;
      document.querySelector('.subs-count').innerHTML = `🎯 <span id="subs-count">—</span> ${data.active_users}`;
      document.querySelector('.about h2').textContent = data.about_title;
      document.querySelector('.about p').innerHTML = data.about_paragraph;
    })
    .catch(err => console.error('Translation load error:', err));
}

// ✅ عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  // 🔀 تحميل الترجمة الافتراضية
  const langSelect = document.getElementById('language-select');
  const defaultLang = langSelect.value || 'en';
  applyTranslations(defaultLang);

  // 🔁 تغيير اللغة
  langSelect.addEventListener('change', () => {
    const selectedLang = langSelect.value;
    applyTranslations(selectedLang);
    document.documentElement.lang = selectedLang;
    document.body.style.direction = selectedLang === 'ar' ? 'rtl' : 'ltr';
  });

  // ✉️ الاشتراك في النشرة
  const form = document.getElementById("subscription-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.elements["email"].value.trim();
    if (!email) return alert("Please enter an e-mail address.");

    grecaptcha.ready(() => {
      grecaptcha.execute('6LfveSIrAAAA', { action: 'subscribe' }).then((token) => {
        document.getElementById("recaptcha-token").value = token;

        fetch("https://script.google.com/macros/s/AKfycbzznyXR05SYR0K0B8hpRza9cyFwHywjuiUudGJofJDoBYR3WZ0LYS5NoB3FiiLxEB4/exec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, action: "subscribe" }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.result === "success") {
            alert("Subscription successful! Check your e-mail for confirmation.");
            form.reset();
          } else {
            alert("Error: " + (data.message || "Something went wrong"));
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("Network error. Please try again.");
        });
      });
    });
  });
});
