{
  "heroTitle": "تشيكرِيل",
  "heroSubtitle": "توقّف عن التخمين، وابدأ بالتحقق.",
  "heroBenefits": [
    "✅ افحص الوسائط قبل أن تُسبب لك مشكلة",
    "✅ ذكاء اصطناعي لتحليل الفيديو، الصوت، والصور",
    "✅ تجربة مجانية: 3 عمليات فحص",
    "✅ 4.99$/شهريًا للوصول الكامل"
  ],
  "startTrial": "ابدأ التجربة المجانية",
  "services": {
    "1": ["إدارة حسابات التواصل", "من الاستراتيجية إلى المحتوى."],
    "2": ["مواقع وتطبيقات ذكاء اصطناعي", "أدوات ذكية لخدمة علامتك."],
    "3": ["حملات تسويقية", "نمو مدفوع بالبيانات."]
  },
  "subscription": {
    "title": "ابدأ تجربتك المجانية",
    "placeholder": "أدخل بريدك الإلكتروني",
    "button": "اشترك",
    "note": "4.99$/شهريًا لكل منتج بعد التجربة",
    "count": "🎯 {count} مستخدم نشط"
  },
  "about": {
    "title": "عن تشيكرِيل",
    "content": "تشيكرِيل هو مشروع تابع لـ Alwafer Media — استوديو شامل لإدارة الحسابات، تطوير مواقع وتطبيقات تعتمد الذكاء الاصطناعي، وإطلاق حملات تسويقية دقيقة.\n\nما ستحصل عليه: فحص فوري للوسائط، إرشادات تصحيح بسيطة، وتجربة مجانية لثلاث ملفات.\nأهمية تشيكرِيل: حماية علامتك التجارية، وتوفير ساعات من العمل، وتجنب الإنذارات والإغلاق."
  }
}
{
  "hero_title": "CheckReel",
  "hero_subtitle": "Stop guessing, start checking.",
  "benefit_1": "✅ Scan your media before it backfires",
  "benefit_2": "✅ AI checks for video, audio, images",
  "benefit_3": "✅ Free trial: 3 total scans",
  "benefit_4": "✅ $4.99/month for unlimited access",
  "start_trial": "Start Free Trial"
}
// Platforms (dynamic)
document.getElementById('platforms-title').innerText = translations['platforms_title'];
const platformList = document.querySelector('.platform-list');
platformList.innerHTML = translations['platforms_list'].map(p => `<span>${p}</span>`).join('');
