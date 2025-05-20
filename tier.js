// Tier management system for CheckReel
const TIER_CONFIG = {
    free: {
        name: 'Free',
        scans: 3,
        price: 0,
        class: 'tier-free',
        features: ['3 scans per month', 'Basic reports', 'Email support']
    },
    plus: {
        name: 'Plus',
        scans: 20,
        price: 4.99,
        class: 'tier-plus',
        features: ['20 scans per month', 'Priority support', 'Detailed reports', 'Platform insights']
    },
    premium: {
        name: 'Premium',
        scans: 40,
        price: 9.99,
        class: 'tier-premium',
        features: ['40 scans per month', 'Priority support', 'Advanced analytics', 'API access', 'Custom reports']
    }
};

function initializeTierSystem() {
    if (!localStorage.getItem('checkreel_tier')) {
        localStorage.setItem('checkreel_tier', 'free');
    }
    
    if (!localStorage.getItem('checkreel_scans_used')) {
        localStorage.setItem('checkreel_scans_used', '0');
    }
    
    checkAndResetMonthlyScans();
}

function getCurrentTier() {
    return localStorage.getItem('checkreel_tier') || 'free';
}

function getScanUsage() {
    const tier = getCurrentTier();
    const used = parseInt(localStorage.getItem('checkreel_scans_used') || '0');
    const total = TIER_CONFIG[tier].scans;
    
    return {
        used: used,
        total: total,
        remaining: Math.max(0, total - used)
    };
}

function canPerformScan() {
    const usage = getScanUsage();
    return usage.remaining > 0;
}

function useScan() {
    if (!canPerformScan()) {
        return false;
    }
    
    const currentUsed = parseInt(localStorage.getItem('checkreel_scans_used') || '0');
    localStorage.setItem('checkreel_scans_used', (currentUsed + 1).toString());
    
    return true;
}

function setUserTier(newTier) {
    if (!TIER_CONFIG[newTier]) {
        console.error('Invalid tier:', newTier);
        return false;
    }
    
    const oldTier = getCurrentTier();
    localStorage.setItem('checkreel_tier', newTier);
    
    if (newTier !== 'free' && oldTier === 'free') {
        localStorage.setItem('checkreel_scans_used', '0');
    }
    
    localStorage.setItem('checkreel_tier_updated', Date.now().toString());
    
    return true;
}

function checkAndResetMonthlyScans() {
    const lastReset = localStorage.getItem('checkreel_last_reset');
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + (now.getMonth() + 1);
    
    if (lastReset !== currentMonth) {
        localStorage.setItem('checkreel_scans_used', '0');
        localStorage.setItem('checkreel_last_reset', currentMonth);
    }
}

function getTierDisplay(tier = null) {
    const currentTier = tier || getCurrentTier();
    const config = TIER_CONFIG[currentTier];
    const usage = getScanUsage();
    
    return {
        name: config.name,
        class: config.class,
        scansText: `${usage.remaining} scans left`,
        progress: ((usage.total - usage.remaining) / usage.total) * 100,
        isLimitReached: usage.remaining === 0
    };
}

async function syncTierWithServer(email, tier) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwKWcb5Tx2wHhyGn5Bwec4nwumlSibm9VPpJ2lR269M8e_xt-x7bUe2GmZX17FKJRk/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=grant&email=${encodeURIComponent(email)}&tier=${encodeURIComponent(tier)}`
        });
        
        const result = await response.json();
        
        if (result.success) {
            setUserTier(tier);
            return true;
        } else {
            console.error('Server tier sync failed:', result.message);
            return false;
        }
    } catch (error) {
        console.error('Tier sync error:', error);
        return false;
    }
}

async function verifyTierWithServer(email) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwKWcb5Tx2wHhyGn5Bwec4nwumlSibm9VPpJ2lR269M8e_xt-x7bUe2GmZX17FKJRk/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=verify&email=${encodeURIComponent(email)}`
        });
        
        const result = await response.json();
        
        if (result.success && result.tier) {
            setUserTier(result.tier);
            return result.tier;
        }
    } catch (error) {
        console.error('Tier verification error:', error);
    }
    
    return getCurrentTier();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTierSystem();
    
    const userEmail = localStorage.getItem('checkreel_user_email');
    if (userEmail) {
        verifyTierWithServer(userEmail);
    }
});

window.tierSystem = {
    getCurrentTier,
    getScanUsage,
    canPerformScan,
    useScan,
    setUserTier,
    getTierDisplay,
    syncTierWithServer,
    verifyTierWithServer,
    TIER_CONFIG
};
