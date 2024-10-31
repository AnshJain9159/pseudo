let copiedQuestion = ''; // Variable to store the copied question

document.addEventListener('DOMContentLoaded', function() {
  // Set styles directly
  document.body.style.backgroundColor = '#0f0f1f';
  document.body.style.color = '#e0e0f0';
  document.querySelector('.primary-button').style.background = 'linear-gradient(135deg, #6a11cb, #2575fc)';

  // Help button functionality (Copy question and send to chat)
  document.getElementById('helpButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyQuestionAndSendToPopup
    });
  });

  // Toggle chat window visibility when Help is clicked
  document.getElementById('helpButton').addEventListener('click', function() {
    document.getElementById('chatWindow').classList.toggle('hidden');
  });

  // Copy button functionality (Copy question to clipboard only)
  document.getElementById('copyButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyQuestionToClipboardOnly
    });
  });
});

// Function to copy question and send it back to popup
function copyQuestionAndSendToPopup() {
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

  // Copy to clipboard using temporary text area
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = formattedText;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);

  // Send message back to popup with the copied question
  chrome.runtime.sendMessage({ action: 'sendToChat', text: formattedText });
}

// Function to copy question to clipboard only (using temporary text area)
function copyQuestionToClipboardOnly() {
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

  // Copy to clipboard using temporary text area
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = formattedText;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);

  console.log('Question copied to clipboard.');
}

// Listen for message from content script to send to chat prompt
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendToChat' && request.text) {
    sendToChat(request.text);
    sendResponse({ status: 'success' });
  }
});

// Function to populate the chat input and submit
function sendToChat(text) {
  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  if (chatInput && chatForm) {
    chatInput.value = text; // Set the question in the chat input field
    chatForm.dispatchEvent(new Event('submit')); // Trigger form submission
  }
}


