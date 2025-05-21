/* -------------------------------------------
   CheckReel – Dashboard logic (clean version)
   ------------------------------------------- */

/* ---------- 1. Safe localStorage wrapper ---------- */
const safeStorage = {
  getItem(key) {
    try { return localStorage.getItem(key); }
    catch { console.warn('localStorage read denied'); return null; }
  },
  setItem(key, value) {
    try { localStorage.setItem(key, value); }
    catch { console.warn('localStorage write denied'); }
  }
};

/* ---------- 2. Global state ---------- */
let selectedFile      = null;
let selectedPlatform  = null;
let selectedRegion    = null;
let selectedCountry   = null;
let currentTier       = safeStorage.getItem('checkreel_tier') || 'free';

/* ---------- 3. Countries per region ---------- */
const countriesData = {
  middleEast: [
    'Palestine', 'Jordan', 'Lebanon', 'Syria', 'Iraq', 'Kuwait', 'Saudi Arabia',
    'Bahrain', 'Qatar', 'United Arab Emirates', 'Oman', 'Yemen', 'Iran', 'Turkey', 'Cyprus'
  ],
  mena: [
    'Palestine', 'Jordan', 'Lebanon', 'Syria', 'Iraq', 'Kuwait', 'Saudi Arabia',
    'Bahrain', 'Qatar', 'United Arab Emirates', 'Oman', 'Yemen', 'Iran', 'Turkey',
    'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan', 'Mauritania', 'Djibouti', 'Somalia'
  ],
  europe: [
    'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium',
    'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece',
    'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Kosovo', 'Latvia',
    'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco',
    'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal',
    'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain',
    'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City'
  ]
};

/* ---------- 4. DOM ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initializeUpload();
  updateTierDisplay();
  updateUserCounter();
  updateScansCounter();

  // restore language
  switchLanguage(safeStorage.getItem('checkreel_language') || 'en');
});

/* ---------- 5. Tier selection ---------- */
function selectTier(tier) {
  currentTier = tier;
  safeStorage.setItem('checkreel_tier', tier);

  // highlight UI
  document.querySelectorAll('.tier-plan').forEach(p => p.classList.remove('active'));
  document.querySelector(`[data-tier="${tier}"]`)?.classList.add('active');

  if (tier !== 'free') safeStorage.setItem('checkreel_scans_used', '0');

  updateTierDisplay();
  updateScansCounter();
}

/* ---------- 6. Region / Platform selection ---------- */
function selectRegion(region) {
  selectedRegion = region;
  document.querySelectorAll('.region-option').forEach(o => o.classList.remove('selected'));
  document.querySelector(`[data-region="${region}"]`)?.classList.add('selected');
  updateSelectionAlert();
  updateScanButton();
}

function selectPlatform(platform) {
  selectedPlatform = platform;
  document.querySelectorAll('.platform-option').forEach(o => o.classList.remove('selected'));
  document.querySelector(`[data-platform="${platform}"]`)?.classList.add('selected');
  updateSelectionAlert();
  updateScanButton();
}

/* ---------- 7. Countries modal ---------- */
function showCountries(region) {
  const modal = document.getElementById('countriesModal');
  const grid  = document.getElementById('countriesGrid');
  const title = document.getElementById('modalTitle');

  title.textContent = `Select Country – ${region.charAt(0).toUpperCase() + region.slice(1)}`;
  grid.innerHTML = '';

  countriesData[region].forEach(c => {
    const div = document.createElement('div');
    div.className = 'country-item';
    div.textContent = c;
    div.onclick = () => selectCountry(c);
    grid.appendChild(div);
  });

  modal.style.display = 'block';
}
function selectCountry(c) { selectedCountry = c; closeCountriesModal(); }
function closeCountriesModal() { document.getElementById('countriesModal').style.display = 'none'; }

/* ---------- 8. Upload area ---------- */
function initializeUpload() {
  const uploadArea  = document.getElementById('uploadArea');
  const fileInput   = document.getElementById('fileInput');
  const removeBtn   = document.getElementById('removeFile');

  if (!uploadArea || !fileInput) return;

  // click
  uploadArea.addEventListener('click', () => {
    if (!selectedRegion || !selectedPlatform) return alert('Please select a region and platform first!');
    fileInput.click();
  });

  // browse
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  });

  // drag-over styling
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    if (selectedRegion && selectedPlatform) uploadArea.classList.add('dragover');
  });
  uploadArea.addEventListener('dragleave', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
  });

  // drop
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (!selectedRegion || !selectedPlatform)
      return alert('Please select a region and platform first!');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  });

  // remove file
  removeBtn?.addEventListener('click', e => {
    e.stopPropagation();
    clearSelectedFile();
  });
}

/* ---------- 9. File helpers ---------- */
function handleFileSelect(file) {
  const allowed = ['video/mp4','video/quicktime','image/jpeg','image/png','audio/mp3','audio/wav'];
  if (!allowed.includes(file.type))
    return alert('Unsupported file type. Use MP4, MOV, JPG, PNG, MP3 or WAV.');

  const max = 100 * 1024 * 1024; // 100 MB
  if (file.size > max) return alert('File is larger than 100 MB.');

  selectedFile = file;
  displayFileInfo(file);
  updateScanButton();
}

function displayFileInfo(file) {
  document.getElementById('uploadArea').style.display = 'none';
  document.getElementById('fileInfo').style.display   = 'block';
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatFileSize(file.size);
}
function clearSelectedFile() {
  selectedFile = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('uploadArea').style.display = 'block';
  document.getElementById('fileInfo').style.display   = 'none';
  updateScanButton();
}
function formatFileSize(b) {
  if (!b) return '0 Bytes';
  const k = 1024, sizes = ['Bytes','KB','MB','GB'];
  const i = Math.floor(Math.log(b)/Math.log(k));
  return `${(b/Math.pow(k,i)).toFixed(2)} ${sizes[i]}`;
}

/* ---------- 10. Scan button state ---------- */
function updateScanButton() {
  const btn = document.getElementById('scanBtn');
  if (!btn) return;
  const ready = selectedFile && selectedPlatform && selectedRegion;
  btn.disabled = !ready;
  btn.classList.toggle('ready', ready);
}
function updateSelectionAlert() {
  document.getElementById('selectionAlert')
          .classList.toggle('hidden', selectedRegion && selectedPlatform);
}

/* ---------- 11. Scan flow (mock) ---------- */
document.getElementById('scanBtn')?.addEventListener('click', async () => {
  if (!selectedFile || !selectedPlatform || !selectedRegion) return;
  if (!checkScanLimit()) return alert('Scan limit reached – upgrade your plan.');

  const btn = document.getElementById('scanBtn');
  const txt = document.getElementById('scan-btn-text');
  const ld  = document.getElementById('btnLoader');

  btn.disabled = true; txt.textContent = 'Analyzing…'; ld.classList.add('active');
  await new Promise(r => setTimeout(r, 3000));               // simulate API
  displayResults(generateMockResults());
  incrementScanCount();
  updateTierDisplay(); updateScansCounter();
  document.getElementById('resultsSection')?.scrollIntoView({behavior:'smooth'});
  btn.disabled = false; txt.textContent = 'Start Content Check'; ld.classList.remove('active');
});

function checkScanLimit() {
  const tier      = safeStorage.getItem('checkreel_tier') || 'free';
  const used      = +safeStorage.getItem('checkreel_scans_used') || 0;
  const limitByT  = { free:3, plus:20, premium:40 }; // adjust if plans change
  return used < limitByT[tier];
}

/* ---------- 12. Mock results ---------- */
function generateMockResults() {
  const score = 70 + Math.floor(Math.random()*31); // 70-100
  const issues = [
    {icon:'⚠️',text:`Audio peaks detected for ${selectedPlatform}`},
    {icon:'📺',text:`Might violate ${selectedRegion} guidelines`},
    {icon:'♿',text:'Consider adding captions'}
  ];
  const recs = [
    {icon:'📈',text:`Use trending hashtags on ${selectedPlatform}`},
    {icon:'⏰',text:`Optimal post time ${selectedRegion}: 7-9 PM`},
    {icon:'🎯',text:'Audience alignment 85 %'}
  ];
  return {
    score,
    status: score>=80?'Ready to Post':'Needs Review',
    statusIcon: score>=80?'✅':'⚠️',
    issues: issues.slice(0,Math.random()*3|0+1),
    recommendations: recs.slice(0,Math.random()*3|0+1)
  };
}
function displayResults(r){
  document.getElementById('resultsSection').style.display='block';
  document.getElementById('scoreValue').textContent = r.score;
  document.querySelector('.score-circle')?.style.setProperty('--score',r.score);
  document.getElementById('status-text').textContent = r.status;
  document.querySelector('.status-icon').textContent = r.statusIcon;

  const makeList = (arr,containerId,cls) => {
    const c = document.getElementById(containerId); if(!c)return;
    c.innerHTML='';
    arr.forEach(i=>{
      const div=document.createElement('div');
      div.className=`${cls}-item`;
      div.innerHTML=`<span class="${cls}-icon">${i.icon}</span><span>${i.text}</span>`;
      c.appendChild(div);
    });
  };
  makeList(r.issues,'issuesList','issue');
  makeList(r.recommendations,'recommendationsList','recommendation');
}
function incrementScanCount(){
  const used = +safeStorage.getItem('checkreel_scans_used') || 0;
  safeStorage.setItem('checkreel_scans_used',(used+1).toString());
}

/* ---------- 13. Tier / counters / language helpers ---------- */
function updateTierDisplay(){
  const tier = safeStorage.getItem('checkreel_tier') || 'free';
  const used = +safeStorage.getItem('checkreel_scans_used') || 0;
  const table = { free:{name:'Free Trial', scans:3 , cls:'tier-free' },
                  plus:{name:'Plus',       scans:20, cls:'tier-plus'},
               premium:{name:'Premium',    scans:40, cls:'tier-premium'} };
  const t = table[tier], left = Math.max(0,t.scans-used);
  document.getElementById('tierBadge').textContent = t.name;
  document.getElementById('tierBadge').className   = `tier-badge ${t.cls}`;
  document.getElementById('scansLeft').textContent = `${left} scans left`;
}
function updateUserCounter(){
  const base=2697, inc=+(safeStorage.getItem('checkreel_user_increment')||(
    safeStorage.setItem('checkreel_user_increment',Math.floor(Math.random()*100)+1), 
    safeStorage.getItem('checkreel_user_increment')));
  document.getElementById('active-users').textContent=`🔥 ${(base+inc).toLocaleString()} active users`;
}
function updateScansCounter(){
  document.getElementById('scansUsedCounter').textContent =
    safeStorage.getItem('checkreel_scans_used')||'0';
}

/* ---------- 14. Language ---------- */
function switchLanguage(lang){
  safeStorage.setItem('checkreel_language',lang);
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  document.documentElement.dir = (lang==='ar')?'rtl':'ltr';
  if(window.loadLanguageContent) window.loadLanguageContent(lang);
}
window.switchLanguage = switchLanguage;

/* ---------- 15. Expose helpers ---------- */
Object.assign(window,{selectTier,selectRegion,selectPlatform,showCountries,
  closeCountriesModal,selectCountry});
