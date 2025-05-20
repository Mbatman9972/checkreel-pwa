// Dashboard functionality
let selectedFile = null;
let selectedPlatform = null;
let currentLanguage = 'en';

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
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearSelectedFile();
    });
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
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    uploadArea.style.display = 'none';
    fileInfo.style.display = 'block';
}

function clearSelectedFile() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileInput = document.getElementById('fileInput');
    
    selectedFile = null;
    fileInput.value = '';
    
    uploadArea.style.display = 'block';
    fileInfo.style.display = 'none';
    
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
    const canScan = selectedFile && selectedPlatform;
    
    scanBtn.disabled = !canScan;
    
    if (canScan) {
        scanBtn.classList.add('ready');
    } else {
        scanBtn.classList.remove('ready');
    }
}

// Scan functionality
document.getElementById('scanBtn').addEventListener('click', async function() {
    if (!selectedFile || !selectedPlatform) return;
    
    // Check if user has scans remaining
    if (!checkScanLimit()) {
        showUpgradeSection();
        return;
    }
    
    await performScan();
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
    
    // Update button state
    scanBtn.disabled = true;
    btnText.textContent = 'Analyzing...';
    btnLoader.classList.add('active');
    
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
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Scan error:', error);
        alert('An error occurred during scanning. Please try again.');
    } finally {
        // Reset button state
        scanBtn.disabled = false;
        btnText.textContent = 'Start Content Check';
        btnLoader.classList.remove('active');
    }
}

function generateMockResults() {
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
    const issues = [
        { icon: '', text: 'Audio volume peaks detected at 0:15' },
        { icon: '', text: 'Low resolution segments found' },
        { icon: '', text: 'Consider adding captions for accessibility' }
    ];
    
    const recommendations = [
        { icon: '', text: 'Use trending hashtags for better reach' },
        { icon: '', text: 'Optimal posting time: 7-9 PM' },
        { icon: '', text: 'Target audience alignment: 85%' }
    ];
    
    return {
        score: score,
        status: score >= 80 ? 'Ready to Post' : 'Needs Review',
        statusIcon: score >= 80 ? '' : '',
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
    scoreValue.textContent = results.score;
    scoreCircle.style.setProperty('--score', results.score);
    
    // Update status
    statusText.textContent = results.status;
    statusIcon.textContent = results.statusIcon;
    
    // Update issues
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
    
    // Update recommendations
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
    
    resultsSection.style.display = 'block';
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
        free: { name: 'Free', scans: 3, class: 'tier-free' },
        plus: { name: 'Plus', scans: 20, class: 'tier-plus' },
        premium: { name: 'Premium', scans: 40, class: 'tier-premium' }
    };
    
    const tier = tierData[userTier];
    const scansLeft = Math.max(0, tier.scans - scansUsed);
    
    document.getElementById('tierBadge').textContent = tier.name;
    document.getElementById('tierBadge').className = `tier-badge ${tier.class}`;
    document.getElementById('scansLeft').textContent = `${scansLeft} scans left`;
}

function showUpgradeSection() {
    const upgradeSection = document.getElementById('upgradeSection');
    upgradeSection.style.display = 'block';
    upgradeSection.scrollIntoView({ behavior: 'smooth' });
}

function upgradeTier(tier) {
    const confirmUpgrade = confirm(`Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan?`);
    
    if (confirmUpgrade) {
        localStorage.setItem('checkreel_tier', tier);
        localStorage.setItem('checkreel_scans_used', '0');
        
        updateTierDisplay();
        hideUpgradeSection();
        
        alert(`Successfully upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan!`);
    }
}

function hideUpgradeSection() {
    const upgradeSection = document.getElementById('upgradeSection');
    upgradeSection.style.display = 'none';
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
        activeUsersEl.textContent = ` ${totalUsers.toLocaleString()} active users`;
    }
}

function switchLanguage(lang) {
    currentLanguage = lang;
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
    } else {
        document.body.removeAttribute('dir');
    }
    
    if (typeof loadLanguageContent === 'function') {
        loadLanguageContent(lang);
    }
}

window.switchLanguage = switchLanguage;
window.upgradeTier = upgradeTier;
