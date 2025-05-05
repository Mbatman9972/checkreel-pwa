// ---------- translations ----------
let translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
    try {
        const res = await fetch(`lang/${lang}.json`);
        translations = await res.json();
    } catch {
        translations = {};                 // fallback
    }
    applyTranslations();
    updateActiveUsers();
}

function txt(path, fallback = '') {
    return path.split('.').reduce((o, k) => o?.[k], translations) ?? fallback;
}

function applyTranslations() {
    document.querySelector('#hero .logo h1').innerText = txt('heroTitle', 'CheckReel');
    document.getElementById('hero-subtitle').innerText = txt('heroSubtitle', 'Stop guessing, start checking.');
    document.getElementById('hero-benefits').innerHTML = (txt('heroBenefits', []))
        .map(t => `<li>${t}</li>`).join('');

    document.getElementById('email-input').placeholder = txt('subscription.placeholder', 'Enter your email');
    document.getElementById('subscribe-button').innerText = txt('subscription.button', 'Subscribe');
    document.getElementById('subscription-note').innerText = txt('subscription.note', '$4.99/month after trial');

    document.getElementById('platforms-title').innerText = txt('platformsTitle', 'Supported Platforms');

    document.getElementById('about-title').innerText = txt('about.title', 'About CheckReel');
    document.getElementById('about-content').innerText = txt('about.content',
        'CheckReel is part of Alwafer Media, specialising in social-media management, AI apps, and precision marketing.');
}

// language switcher
document.getElementById('language-switcher')
    .addEventListener('change', e => loadLanguage(e.target.value));

loadLanguage(currentLang);

// ---------- active-user counter ----------
let activeUsers = 2697;

function updateActiveUsers() {
    const el = document.getElementById('active-users');
    const fmt = txt('subscription.count', '🎯 {count} Active Users');
    el.innerText = fmt.replace('{count}', activeUsers);
}

// ---------- subscription (Google Apps Script) ----------
const API_URL = 'https://script.google.com/macros/s/AKfycbzc0kBGiRbYFub92GGIX076b4ycega09dPV8dVU-LX8Jaxl82C1VPVvb2evFU6jbKw/exec';
async function subscribeUser(email) {
    try {
        const res = await fetch(`${API_URL}?action=subscribe&email=${encodeURIComponent(email)}`);
        const reply = await res.json();
        if (reply.result === 'success') {
            alert('✅ Thanks for subscribing! Check your email.');
            document.getElementById('email-input').value = '';
            activeUsers++;
            updateActiveUsers();
        } else {
            alert(`⚠️ ${reply.message || 'Subscription failed.'}`);
        }
    } catch (err) {
        console.error(err);
        alert('⚠️ Server error. Try again later.');
    }
}

document.getElementById('subscribe-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) subscribeUser(email);
    else alert('⚠️ Please enter a valid email address.');
});