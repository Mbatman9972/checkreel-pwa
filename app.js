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
    updateDisplayedActiveUsers(); // Call to update the displayed count on load
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
const INITIAL_ACTIVE_USERS = 2672;
let displayedActiveUsers = INITIAL_ACTIVE_USERS;

function updateDisplayedActiveUsers() {
    const el = document.getElementById('active-users');
    const fmt = txt('subscription.count', '🎯 {count} Active Users');
    el.innerText = fmt.replace('{count}', displayedActiveUsers);
}

// ---------- subscription (Google Apps Script) ----------
const API_URL = 'https://script.google.com/macros/s/AKfycbzALs8jubOwQdxgd6sqeiZRsWYH4zunfI5Grs1MeaFct0ES80uTgvvbGfKzphQglgID/exec';

async function subscribeUser(email) {
    console.log('Attempting to subscribe with email:', email);
    try {
        const params = new URLSearchParams();
        params.append('action', 'subscribe');
        params.append('email', email);

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        const reply = await res.json();
        if (reply.result === 'success') {
            alert('✅ Thanks for subscribing! Check your email.');
            document.getElementById('email-input').value = '';
            displayedActiveUsers++; // Increment the displayed count on successful subscription
            updateDisplayedActiveUsers(); // Update the displayed count immediately
            // We no longer fetch the actual count here, as we want to maintain the incremented fake number
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

// Initialize the displayed count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDisplayedActiveUsers();
});

// We are no longer periodically fetching the actual count
// If you need to sync the displayed count with the sheet later,
// you'll need to re-introduce a mechanism for that.