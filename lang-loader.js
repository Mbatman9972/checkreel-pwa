(function(){
  const DEF='en',KEY='selectedLanguage';
  let cur=localStorage.getItem(KEY)||DEF,dict={};
  async function load(lang){
    try{
      const r=await fetch(`lang/${lang}.json`);
      if(!r.ok)throw 0;
      const j=await r.json();
      if(!j||!Object.keys(j).length)throw 0;
      dict=j;cur=lang;localStorage.setItem(KEY,lang);
    }catch{if(lang!==DEF)return load(DEF);}
    apply();
    document.documentElement.lang=cur;
    document.documentElement.dir=cur==='ar'?'rtl':'ltr';
  }
  function apply(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.dataset.i18n;
      el.innerHTML=dict[k]||el.innerHTML;
    });
  }
  window.setLanguage=l=>l!==cur&&load(l);
  load(cur);
})();
