document.addEventListener('DOMContentLoaded', () => {
    // Simulate user detection (you’ll replace this with actual user session/email later)
    const userEmail = localStorage.getItem('checkreel_user_email') || 'demo@user.com';
  
    document.getElementById('user-status').innerText = `Logged in as: ${userEmail}`;
  
    const uploadInput = document.getElementById('content-upload');
    const submitButton = document.getElementById('submit-button');
    const feedbackBox = document.getElementById('ai-feedback');
    const resultSection = document.getElementById('result-section');
    const historyList = document.getElementById('history-list');
  
    let checkCount = 0;
    const MAX_FREE_CHECKS = 3;
  
    submitButton.addEventListener('click', () => {
      const file = uploadInput.files[0];
      if (!file) {
        alert('Please upload a content file first.');
        return;
      }
  
      // Check if user exceeded free limit (mocked for now)
      if (checkCount >= MAX_FREE_CHECKS) {
        alert('You’ve reached the maximum of 3 free checks. Please upgrade to continue.');
        return;
      }
  
      resultSection.style.display = 'block';
      feedbackBox.innerText = '🧠 Analyzing content...';
  
      // Simulated GPT feedback (you'll replace this with real OpenAI call)
      setTimeout(() => {
        const fakeFeedback = `✅ Your content passed all platform compliance checks.\n📈 Tip: Boost engagement by adding a trending hook.`;
        feedbackBox.innerText = fakeFeedback;
  
        const historyItem = document.createElement('li');
        historyItem.innerText = `Check #${checkCount + 1}: Passed – ${new Date().toLocaleString()}`;
        historyList.appendChild(historyItem);
  
        checkCount++;
      }, 2000);
    });
  });
  