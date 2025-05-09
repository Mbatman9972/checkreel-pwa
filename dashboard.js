submitButton.addEventListener('click', async () => {
    const file = uploadInput.files[0];
    if (!file) {
      alert('Please upload a content file first.');
      return;
    }
  
    if (checkCount >= MAX_FREE_CHECKS) {
      alert('You’ve reached the maximum of 3 free checks. Please upgrade to continue.');
      return;
    }
  
    resultSection.style.display = 'block';
    feedbackBox.innerText = '🧠 Analyzing your content...';
  
    // Simulate a prompt based on file name and type
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
  
      const historyItem = document.createElement('li');
      historyItem.innerText = `Check #${checkCount + 1}: ${new Date().toLocaleString()}`;
      historyList.appendChild(historyItem);
  
      checkCount++;
    } catch (err) {
      console.error(err);
      feedbackBox.innerText = '⚠️ Error analyzing content.';
    }
  });
  