/* ---------- language / UI ---------- */
let translations = {};
let currentLang  = 'en';

async function loadLang(lang){
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  applyTxt();         // fill texts once loaded
  updateCounter();    // refresh counter with correct template
}
function applyTxt(){
  const $ = id => document.getElementById(id);
  $('hero-title').innerText           = translations.heroTitle;
  $('hero-subtitle').innerText        = translations.heroSubtitle;
  $('hero-benefits').innerHTML        = translations.heroBenefits.map(t=>`<p>${t}</p>`).join('');
  $('subscribe-button').innerText     = translations.subscription.button;
  $('email-input').placeholder        = translations.subscription.placeholder;
  $('subscription-note').innerText    = translations.subscription.note;
  $('platforms-title').innerText      = translations.platformsTitle;
  $('about-title').innerText          = translations.about.title;
  $('about-content').innerText        = translations.about.content;
}

/* ---------- fake active users badge ---------- */
let activeUsers = 2697;
const $badge = document.getElementById('active-users');
function updateCounter(){
  const t = translations?.subscription?.count || '🎯 {count} Active Users';
  $badge.innerText = t.replace('{count}', activeUsers);
}

/* ---------- subscribe flow ---------- */
const API_URL = 'https://script.google.com/macros/s/AKfycbwKWcb5Tx2wHhyGn5Bwec4nwumlSibm9VPpJ2lR269M8e_xt-x7bUe2GmZX17FKJRk/exec';  // <== YOUR web-app URL

function subscribe(email){
  fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`)
    .then(r => r.json())
    .then(j => {
       if(j.result==='success'){
         alert('✅ Thanks for subscribing!');
         activeUsers++; updateCounter();
       }else{
         alert(`⚠️ ${j.message}`);
       }
    })
    .catch(err=>{
       console.error(err);
       alert('⚡ Server error – try later');
    });
}

/* ---------- event wiring ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  loadLang(currentLang);

  document.getElementById('language-switcher')
    .addEventListener('change',e=>loadLang(e.target.value));

  document.getElementById('subscribe-form')
    .addEventListener('submit',e=>{
       e.preventDefault();
       const email = document.getElementById('email-input').value.trim();
       if(email) subscribe(email);
       else alert('⚠️ Enter a valid e-mail');
    });
});
