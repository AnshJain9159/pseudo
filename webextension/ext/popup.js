let copiedQuestion = ''; // Variable to store the copied question

document.addEventListener('DOMContentLoaded', function() {
  // Set theme colors
  document.body.style.backgroundColor = '#000000';
  document.body.style.color = '#ffffff';
  
  // Update primary button gradient
  const primaryButton = document.querySelector('.primary-button');
  primaryButton.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
  primaryButton.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';

  const helpText = document.getElementById('helpText');
  const chatWindow = document.getElementById('chatWindow');

  // Add button hover effects
  document.querySelectorAll('.primary-button, .secondary-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      if (button.classList.contains('primary-button')) {
        button.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.3)';
      } else {
        button.style.background = 'rgba(255, 255, 255, 0.05)';
      }
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      if (button.classList.contains('primary-button')) {
        button.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
      } else {
        button.style.background = 'rgba(255, 255, 255, 0.02)';
      }
    });
  });

  // Help button functionality
  document.getElementById('helpButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyQuestionAndSendToPopup
    });

    // Smooth transition for chat window
    chatWindow.style.opacity = '0';
    chatWindow.classList.remove('hidden');
    chatWindow.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      chatWindow.style.opacity = '1';
      chatWindow.style.transform = 'translateY(0)';
    }, 50);
  });

  // Copy button functionality
  document.getElementById('copyButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyQuestionToClipboardOnly
    });

    // Add copy feedback animation
    const button = document.getElementById('copyButton');
    button.innerHTML = '<span class="icon">✓</span> Copied!';
    setTimeout(() => {
      button.innerHTML = '<span class="icon">📋</span> Copy Question';
    }, 2000);
  });

  // Add smooth transitions for messages
  document.querySelectorAll('.message').forEach(msg => {
    msg.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    msg.style.opacity = '0';
    msg.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      msg.style.opacity = '1';
      msg.style.transform = 'translateY(0)';
    }, 50);
  });

  // Enhance status indicator animation
  const dot = document.querySelector('.dot');
  dot.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
});

// Function to copy question and send it back to popup
function copyQuestionAndSendToPopup() {
  function formatCodeBlock(text) {
    return '```\n' + text.trim() + '\n```';
  }

  function getLeetCodeQuestion() {
    const title = document.querySelector('.text-title-large.font-semibold.text-text-primary')?.innerText || 'Title not found';
    const content = document.querySelector('.elfjS[data-track-load="description_content"]');
    
    let description = '';
    if (content) {
      // Enhanced content extraction with better formatting
      const elements = content.querySelectorAll('p, pre, ul, ol, .example');
      let inExample = false;
      let exampleCount = 1;

      elements.forEach((el) => {
        // Handle examples
        if (el.classList.contains('example') || el.textContent.trim().startsWith('Example')) {
          if (!inExample) {
            description += `\n**Example ${exampleCount}:**\n`;
            inExample = true;
            exampleCount++;
          }
        } else {
          inExample = false;
        }

        if (el.tagName === 'UL' || el.tagName === 'OL') {
          description += '\n';
          el.querySelectorAll('li').forEach(li => {
            // Format constraints and list items
            const text = li.innerText.trim();
            if (text.toLowerCase().includes('constraint')) {
              description += `**${text}**\n`;
            } else {
              description += `• ${text}\n`;
            }
          });
          description += '\n';
        } else if (el.tagName === 'PRE') {
          // Format code blocks with proper spacing
          const codeText = el.innerText.trim();
          if (codeText.includes('Input:') || codeText.includes('Output:')) {
            const parts = codeText.split(/(?=Input:|Output:)/).map(part => part.trim());
            description += parts.map(part => part).join('\n') + '\n\n';
          } else {
            description += formatCodeBlock(codeText) + '\n\n';
          }
        } else {
          // Format regular paragraphs and handle constraints
          const text = el.innerText.trim();
          if (text.toLowerCase().includes('constraint')) {
            description += `\n**Constraints:**\n${text.replace('Constraints:', '')}\n\n`;
          } else if (text) {
            description += text + '\n\n';
          }
        }
      });
    } else {
      description = 'Description not found';
    }

    // Clean up extra newlines and spacing
    description = description
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+$/gm, '')
      .trim();

    return { title, description };
  }

  const question = getLeetCodeQuestion();
  const formattedText = `**Problem: ${question.title}**\n\n${question.description}`;

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

// Function to copy question to clipboard only
function copyQuestionToClipboardOnly() {
  const question = getLeetCodeQuestion();
  const formattedText = `**Problem: ${question.title}**\n\n${question.description}`;
  
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = formattedText;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
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

// Update animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }

  .chat-window {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hidden {
    display: none;
    opacity: 0;
    transform: translateY(10px);
  }
`;
document.head.appendChild(style);


