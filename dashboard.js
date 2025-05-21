// Add this to the beginning of your dashboard.js file to fix localStorage errors

// Safe localStorage wrapper to handle security errors
const safeStorage = {
    getItem: function(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('localStorage access denied, using fallback');
            return null;
        }
    },
    
    setItem: function(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('localStorage write denied, changes will not persist');
        }
    }
};

// Replace all localStorage calls in your existing code with safeStorage
// For example:
// OLD: localStorage.getItem('checkreel_language')
// NEW: safeStorage.getItem('checkreel_language')

// Updated functions with safe storage:
function switchLanguage(lang) {
    if (typeof window.currentLanguage === 'undefined') {
        window.currentLanguage = 'en';
    }
    
    window.currentLanguage = lang;
    safeStorage.setItem('checkreel_language', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="switchLanguage('${lang}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    if (lang === 'ar') {
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.body.removeAttribute('dir');
        document.documentElement.removeAttribute('dir');
    }
    
    console.log('Language switched to:', lang);
}

function selectTier(tier) {
    currentTier = tier;
    safeStorage.setItem('checkreel_tier', tier);
    
    document.querySelectorAll('.tier-plan').forEach(plan => {
        plan.classList.remove('active');
    });
    document.querySelector(`[data-tier="${tier}"]`).classList.add('active');
    
    if (tier !== 'free') {
        safeStorage.setItem('checkreel_scans_used', '0');
    }
    
    updateTierDisplay();
    updateScansCounter();
}

function updateTierDisplay() {
    const userTier = safeStorage.getItem('checkreel_tier') || 'free';
    const scansUsed = parseInt(safeStorage.getItem('checkreel_scans_used') || '0');
    
    const tierData = {
        free: { name: 'Free Trial', scans: 3, class: 'tier-free' },
        plus: { name: 'Plus', scans: 20, class: 'tier-plus' },
        premium: { name: 'Premium', scans: 40, class: 'tier-premium' }
    };
    
    const tier = tierData[userTier];
    const scansLeft = Math.max(0, tier.scans - scansUsed);
    
    const tierBadge = document.getElementById('tierBadge');
    const scansLeftEl = document.getElementById('scansLeft');
    
    if (tierBadge) {
        tierBadge.textContent = tier.name;
        tierBadge.className = `tier-badge ${tier.class}`;
    }
    
    if (scansLeftEl) {
        scansLeftEl.textContent = `${scansLeft} scans left`;
    }
}

function incrementScanCount() {
    const currentCount = parseInt(safeStorage.getItem('checkreel_scans_used') || '0');
    safeStorage.setItem('checkreel_scans_used', (currentCount + 1).toString());
}

function updateScansCounter() {
    const scansUsed = parseInt(safeStorage.getItem('checkreel_scans_used') || '0');
    const counterEl = document.getElementById('scansUsedCounter');
    if (counterEl) {
        counterEl.textContent = scansUsed;
    }
}

function updateUserCounter() {
    const baseCount = 2697;
    let userIncrement = safeStorage.getItem('checkreel_user_increment');
    if (!userIncrement) {
        userIncrement = Math.floor(Math.random() * 100) + 1;
        safeStorage.setItem('checkreel_user_increment', userIncrement.toString());
    }
    const totalUsers = baseCount + parseInt(userIncrement);
    
    const activeUsersEl = document.getElementById('active-users');
    if (activeUsersEl) {
        activeUsersEl.textContent = `🔥 ${totalUsers.toLocaleString()} active users`;
    }
}// Dashboard functionality
let selectedFile = null;
let selectedPlatform = null;
// Removed duplicate currentLanguage declaration - using global scope

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
    initializePlatforms();
    updateTierDisplay();
    updateUserCounter();
    
    // Load saved language preference
    const savedLang = localStorage.getItem('checkreel_language') || 'en';
    switchLanguage(savedLang);
});

// File upload functionality
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const removeFileBtn = document.getElementById('removeFile');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to browse
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
    
    // Remove file
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearSelectedFile();
        });
    }
}

function handleFileSelect(file) {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png', 'audio/mp3', 'audio/wav'];
    if (!allowedTypes.includes(file.type)) {
        alert('Unsupported file type. Please select MP4, MOV, JPG, PNG, MP3, or WAV files.');
        return;
    }
    
    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
        alert('File size too large. Please select a file smaller than 100MB.');
        return;
    }
    
    selectedFile = file;
    displayFileInfo(file);
    updateScanButton();
}

function displayFileInfo(file) {
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    
    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (fileInfo) fileInfo.style.display = 'block';
}

function clearSelectedFile() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileInput = document.getElementById('fileInput');
    
    selectedFile = null;
    if (fileInput) fileInput.value = '';
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (fileInfo) fileInfo.style.display = 'none';
    
    updateScanButton();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Platform selection
function initializePlatforms() {
    const platformOptions = document.querySelectorAll('.platform-option');
    
    platformOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove previous selection
            platformOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            option.classList.add('selected');
            selectedPlatform = option.dataset.platform;
            
            updateScanButton();
        });
    });
}

function updateScanButton() {
    const scanBtn = document.getElementById('scanBtn');
    if (!scanBtn) return;
    
    const canScan = selectedFile && selectedPlatform;
    
    scanBtn.disabled = !canScan;
    
    if (canScan) {
        scanBtn.classList.add('ready');
    } else {
        scanBtn.classList.remove('ready');
    }
}

// Scan functionality
document.addEventListener('DOMContentLoaded', function() {
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.addEventListener('click', async function() {
            if (!selectedFile || !selectedPlatform) return;
            
            // Check if user has scans remaining
            if (!checkScanLimit()) {
                showUpgradeSection();
                return;
            }
            
            await performScan();
        });
    }
});

function checkScanLimit() {
    const userTier = localStorage.getItem('checkreel_tier') || 'free';
    const scansUsed = parseInt(localStorage.getItem('checkreel_scans_used') || '0');
    
    const limits = {
        free: 3,
        plus: 20,
        premium: 40
    };
    
    return scansUsed < limits[userTier];
}

async function performScan() {
    const scanBtn = document.getElementById('scanBtn');
    const btnText = document.getElementById('scan-btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const resultsSection = document.getElementById('resultsSection');
    
    if (!scanBtn) return;
    
    // Update button state
    scanBtn.disabled = true;
    if (btnText) btnText.textContent = 'Analyzing...';
    if (btnLoader) btnLoader.classList.add('active');
    
    try {
        // Simulate scan process
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate mock results
        const results = generateMockResults();
        
        // Display results
        displayResults(results);
        
        // Increment scan count
        incrementScanCount();
        
        // Update tier display
        updateTierDisplay();
        
        // Scroll to results
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
    } catch (error) {
        console.error('Scan error:', error);
        alert('An error occurred during scanning. Please try again.');
    } finally {
        // Reset button state
        scanBtn.disabled = false;
        if (btnText) btnText.textContent = 'Start Content Check';
        if (btnLoader) btnLoader.classList.remove('active');
    }
}

function generateMockResults() {
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
    const issues = [
        { icon: '⚠️', text: 'Audio volume peaks detected at 0:15' },
        { icon: '📺', text: 'Low resolution segments found' },
        { icon: '♿', text: 'Consider adding captions for accessibility' }
    ];
    
    const recommendations = [
        { icon: '📈', text: 'Use trending hashtags for better reach' },
        { icon: '⏰', text: 'Optimal posting time: 7-9 PM' },
        { icon: '🎯', text: 'Target audience alignment: 85%' }
    ];
    
    return {
        score: score,
        status: score >= 80 ? 'Ready to Post' : 'Needs Review',
        statusIcon: score >= 80 ? '✅' : '⚠️',
        issues: issues.slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 1)
    };
}

function displayResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    const scoreValue = document.getElementById('scoreValue');
    const statusText = document.getElementById('status-text');
    const statusIcon = document.querySelector('.status-icon');
    const issuesList = document.getElementById('issuesList');
    const recommendationsList = document.getElementById('recommendationsList');
    const scoreCircle = document.querySelector('.score-circle');
    
    // Update score
    if (scoreValue) scoreValue.textContent = results.score;
    if (scoreCircle) scoreCircle.style.setProperty('--score', results.score);
    
    // Update status
    if (statusText) statusText.textContent = results.status;
    if (statusIcon) statusIcon.textContent = results.statusIcon;
    
    // Update issues
    if (issuesList) {
        issuesList.innerHTML = '';
        results.issues.forEach(issue => {
            const item = document.createElement('div');
            item.className = 'issue-item';
            item.innerHTML = `
                <span class="issue-icon">${issue.icon}</span>
                <span>${issue.text}</span>
            `;
            issuesList.appendChild(item);
        });
    }
    
    // Update recommendations
    if (recommendationsList) {
        recommendationsList.innerHTML = '';
        results.recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <span class="recommendation-icon">${rec.icon}</span>
                <span>${rec.text}</span>
            `;
            recommendationsList.appendChild(item);
        });
    }
    
    if (resultsSection) resultsSection.style.display = 'block';
}

function incrementScanCount() {
    const currentCount = parseInt(localStorage.getItem('checkreel_scans_used') || '0');
    localStorage.setItem('checkreel_scans_used', (currentCount + 1).toString());
}

// Tier management
function updateTierDisplay() {
    const userTier = localStorage.getItem('checkreel_tier') || 'free';
    const scansUsed = parseInt(localStorage.getItem('checkreel_scans_used') || '0');
    
    const tierData = {
        free: { name: 'Free Trial', scans: 3, class: 'tier-free' },
        plus: { name: 'Plus', scans: 20, class: 'tier-plus' },
        premium: { name: 'Premium', scans: 40, class: 'tier-premium' }
    };
    
    const tier = tierData[userTier];
    const scansLeft = Math.max(0, tier.scans - scansUsed);
    
    const tierBadge = document.getElementById('tierBadge');
    const scansLeftEl = document.getElementById('scansLeft');
    
    if (tierBadge) {
        tierBadge.textContent = tier.name;
        tierBadge.className = `tier-badge ${tier.class}`;
    }
    
    if (scansLeftEl) {
        scansLeftEl.textContent = `${scansLeft} scans left`;
    }
}

function showUpgradeSection() {
    const upgradeSection = document.getElementById('upgradeSection');
    if (upgradeSection) {
        upgradeSection.style.display = 'block';
        upgradeSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function upgradeTier(tier) {
    const tierNames = {
        plus: 'Plus ($4.99/month)',
        premium: 'Premium ($9.99/month)'
    };
    
    const confirmUpgrade = confirm(`Upgrade to ${tierNames[tier]}?`);
    
    if (confirmUpgrade) {
        localStorage.setItem('checkreel_tier', tier);
        localStorage.setItem('checkreel_scans_used', '0');
        
        updateTierDisplay();
        hideUpgradeSection();
        
        alert(`Successfully upgraded to ${tierNames[tier]}!`);
    }
}

function hideUpgradeSection() {
    const upgradeSection = document.getElementById('upgradeSection');
    if (upgradeSection) {
        upgradeSection.style.display = 'none';
    }
}

function updateUserCounter() {
    const baseCount = 2697;
    let userIncrement = localStorage.getItem('checkreel_user_increment');
    if (!userIncrement) {
        userIncrement = Math.floor(Math.random() * 100) + 1;
        localStorage.setItem('checkreel_user_increment', userIncrement.toString());
    }
    const totalUsers = baseCount + parseInt(userIncrement);
    const activeUsersEl = document.getElementById('active-users');
    if (activeUsersEl) {
        activeUsersEl.textContent = `🔥 ${totalUsers.toLocaleString()} active users`;
    }
}

function switchLanguage(lang) {
    // Use global currentLanguage or create if not exists
    if (typeof window.currentLanguage === 'undefined') {
        window.currentLanguage = 'en';
    }
    
    window.currentLanguage = lang;
    localStorage.setItem('checkreel_language', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="switchLanguage('${lang}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    if (lang === 'ar') {
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.body.removeAttribute('dir');
        document.documentElement.removeAttribute('dir');
    }
    
    // Apply language content if function exists
    if (typeof window.loadLanguageContent === 'function') {
        window.loadLanguageContent(lang);
    }
    
    console.log('Language switched to:', lang);
}

// Make functions globally available
window.switchLanguage = switchLanguage;
window.upgradeTier = upgradeTier;