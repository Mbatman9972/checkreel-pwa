// 🔐 Restrict dashboard access if not subscribed
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('checkreel_user_email');
    if (!email) {
      alert('Please subscribe or log in first.');
      window.location.href = '/';
    }
  });
  
  function getUserRole(email) {
    if (!email) return 'Free';
    if (email.endsWith('@pro.com')) return 'Premium'; // $9.99
    if (email.endsWith('@sub.com')) return 'Paid';    // $4.99
    return 'Free';
  }
  
  const uploadInput = document.getElementById('content-upload');
  const submitButton = document.getElementById('submit-button');
  const resultSection = document.getElementById('result-section');
  const feedbackBox = document.getElementById('ai-feedback');
  const historyList = document.getElementById('history-list');
  
  let checkCount = 0;
  const MAX_FREE_CHECKS = 3;
  
  submitButton.addEventListener('click', async () => {
    const file = uploadInput.files[0];
    if (!file) {
      alert('Please upload a content file first.');
      return;
    }
  
    const email = localStorage.getItem('checkreel_user_email') || '';
    const role = getUserRole(email);
  
    if (role !== 'Premium') {
      alert('⚠️ Content analysis is available only to $9.99 Premium subscribers.');
      return;
    }
  
    const sessionHistory = JSON.parse(localStorage.getItem('checkreel_history') || '[]');
    const existing = sessionHistory.find(item => item.name === file.name);
    if (existing) {
      resultSection.style.display = 'block';
      feedbackBox.innerHTML = `
        <em>⚡ Showing cached result for: ${existing.name}</em><br><br>
        ${existing.result}
      `;
      return;
    }
  
    resultSection.style.display = 'block';
    feedbackBox.innerText = '🧠 Analyzing your content...';
  
    const prompt = `Analyze this ${file.type} content titled "${file.name}". Provide feedback on compliance for TikTok, YouTube, and Instagram. Highlight potential copyright issues and suggest improvements.`;
  
    try {
      const res = await fetch('/.netlify/functions/ai-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
  
      const data = await res.json();
      const feedback = data.reply || 'No feedback received.';
      feedbackBox.innerText = feedback;
  
      const resultObj = {
        name: file.name,
        type: file.type,
        result: feedback,
        timestamp: new Date().toLocaleString()
      };
      sessionHistory.push(resultObj);
      localStorage.setItem('checkreel_history', JSON.stringify(sessionHistory));
  
      const historyItem = document.createElement('li');
      historyItem.innerText = `Check: ${file.name} at ${resultObj.timestamp}`;
      historyList.appendChild(historyItem);
  
    } catch (err) {
      console.error(err);
      feedbackBox.innerText = '⚠️ Error analyzing content.';
    }
  });
  