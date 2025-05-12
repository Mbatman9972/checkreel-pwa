/* platform select --------------------------------------------------------*/
const buttons=[...document.querySelectorAll('.platform')];
let selectedPlatform='facebook';
buttons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    buttons.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPlatform=btn.id;
  });
});

/* region ---------------------------------------------------------------*/
let selectedRegion='mena';
document.getElementById('regions').addEventListener('change',e=>{
  if(e.target.name==='region')selectedRegion=e.target.value;
});

/* beautified file label ------------------------------------------------*/
const fileInput=document.getElementById('fileInput');
const fileLabelText=document.getElementById('fileLabelText');
fileInput.addEventListener('change',()=>{
  fileLabelText.textContent=fileInput.files[0]?fileInput.files[0].name:'Choose a file…';
});

/* scan mock ------------------------------------------------------------*/
document.getElementById('scanBtn').addEventListener('click',()=>{
  const file=fileInput.files[0];
  if(!file)return alert('Choose a file first');
  const li=document.createElement('li');
  const icon=document.createElement('img');
  icon.src=`images/platform-logos/${selectedPlatform}.png`;
  icon.alt=selectedPlatform;
  li.appendChild(icon);
  li.append(`${new Date().toLocaleTimeString()} — ${file.name} ✓ [${selectedPlatform.toUpperCase()} • ${selectedRegion.toUpperCase()}]`);
  document.getElementById('history').prepend(li);
});
