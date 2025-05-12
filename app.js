/* ------------------------------------------------------------------
   CheckReel · Landing‐page logic  (v2.5)
   – language selector persistence handled by lang-loader.js
   – clean subscribe flow → redirects to dashboard.html
   – safe active-user counter (starts 2697, +1 on each subscribe)
-------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- active users counter ---------- */
  const BASE = 2697;
  const COUNTER_KEY = 'cr-active-count';
  const counterEl = document.querySelector('[data-i18n="home-active-users"]');

  function getCount() {
    return parseInt(localStorage.getItem(COUNTER_KEY) || BASE, 10);
  }
  function setCount(val) {
    localStorage.setItem(COUNTER_KEY, val);
  }
  function showCount() {
    if (!counterEl) return;
    const n = getCount();
    // keep the original translation string but replace {count} if present
    const tmpl = counterEl.innerHTML.includes('{count}')
      ? counterEl.innerHTML
      : '🎯 {count} active users';
    counterEl.innerHTML = tmpl.replace('{count}', n.toLocaleString());
  }
  showCount();

  /* ---------- subscribe flow ---------- */
  const form = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('email-input');

  if (form && emailInput) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email.');
        return;
      }
      try {
        // store user email + bump counter
        localStorage.setItem('checkreel-user-email', email);
        setCount(getCount() + 1);
        // go dashboard
        window.location.href = 'dashboard.html';
      } catch (err) {
        console.error('[Subscribe]', err);
        alert('⚠️ Server error. Try again later.');
      }
    });
  }

});
