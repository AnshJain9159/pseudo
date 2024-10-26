// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Copy button functionality
  document.getElementById('copyButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyQuestion
    });
  });

  // Start session button functionality
  document.getElementById('startSession').addEventListener('click', async () => {
    const mode = document.getElementById('learningMode').value;
    // TODO: Implement session start logic
    console.log('Starting session in mode:', mode);
  });

  // Settings button functionality
  document.getElementById('settings').addEventListener('click', () => {
    // TODO: Implement settings panel toggle
    console.log('Settings clicked');
  });

  // Help button functionality
  document.getElementById('help').addEventListener('click', () => {
    // TODO: Implement help documentation
    console.log('Help clicked');
  });
});

// Your existing copy functionality
function copyQuestion() {
  function getLeetCodeQuestion() {
    const title = document.querySelector('.text-title-large.font-semibold.text-text-primary')?.innerText || 'Title not found';
    const content = document.querySelector('.elfjS[data-track-load="description_content"]');

    let description = '';
    if (content) {
      content.querySelectorAll('p, pre').forEach((el) => {
        description += el.innerText + '\n';
      });
    } else {
      description = 'Description not found';
    }

    return { title, description };
  }

  const question = getLeetCodeQuestion();
  const formattedText = `${question.title}\n\n${question.description}`;
  
  // Send question to the background script instead of copying to clipboard
  chrome.runtime.sendMessage({
    action: 'sendQuestionToChat',
    question: formattedText
  });
}
