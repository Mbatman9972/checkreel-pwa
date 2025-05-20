/* CheckReel  landing logic (v2.6) */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- language selector ---------- */
  const sel = document.getElementById('language-select');
  const cur = localStorage.getItem('selectedLanguage') || 'en';
  sel.value = cur;
  sel.onchange = e => {
    localStorage.setItem('selectedLanguage', e.target.value);
    location.reload();
  };

  /* ---------- active-user counter ---------- */
  const BASE = 2697;
  const KEY  = 'cr-active-count';
  const el   = document.getElementById('active-users');

  function get()  { return +(localStorage.getItem(KEY) || BASE); }
  function set(v) { localStorage.setItem(KEY, v); }
  function show() {
    if (!el) return;
    el.innerText =   active users;
  }
  show();

  /* ---------- subscribe flow ---------- */
  document.getElementById('subscribe-form').onsubmit = e => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email.');

    try {
      localStorage.setItem('checkreel-user-email', email);
      set(get() + 1);
      window.location.href = 'dashboard.html';
    } catch {
      alert(' Server error. Try again later.');
    }
  };

});
