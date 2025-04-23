/************************************************************
 *  Checkreel front-end script
 *  – RTL support
 *  – Sends subscription via GET (no-cors) to Apps Script
 ************************************************************/

/* 1 RTL / LTR */
document.body.style.direction =
  document.documentElement.lang === 'ar' ? 'rtl' : 'ltr';

/* 2 Subscription form */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subscription-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.elements['email'].value.trim();
    if (!email) return alert('Please enter an e-mail address.');

    /* LIVE Apps Script endpoint (paste your /exec URL) */
    const endpoint =
      'https://script.google.com/macros/s/PASTE_YOUR_NEW_EXEC_URL_HERE/exec';

    /* Build query-string & use no-cors to skip CORS pre-flight */
    const url =
      endpoint +
      '?action=subscribe&email=' +
      encodeURIComponent(email);

    fetch(url, { method: 'GET', mode: 'no-cors' })
      .then(() => {
        alert('Subscription successful! Check your e-mail for confirmation.');
        form.reset();
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        alert('Network error. Please try again.');
      });
  });
});

