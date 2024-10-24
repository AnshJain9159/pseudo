// Wait for the page to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Function to retry DOM element selection
  const waitForElement = async (selector, timeout = 5000) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return null;
  };

  try {
    // Select the question elements with retry mechanism
    const titleElement = await waitForElement('.text-title-large.font-semibold.text-text-primary');
    const descriptionElement = await waitForElement('.elfjS[data-track-load="description_content"]');
    const difficultyElement = document.querySelector('[data-difficulty]');
    const testcasesElement = document.querySelector('[data-track-load="console-starter-code"]');

    if (titleElement && descriptionElement) {
      // Capture basic problem information
      const questionTitle = titleElement.innerText;
      let questionDescription = '';

      // Enhanced description capture
      descriptionElement.querySelectorAll('p, pre, ul, ol').forEach((el) => {
        if (el.tagName === 'UL' || el.tagName === 'OL') {
          // Handle lists specially
          el.querySelectorAll('li').forEach(li => {
            questionDescription += `• ${li.innerText}\n`;
          });
        } else {
          questionDescription += el.innerText + '\n\n';
        }
      });

      // Capture additional problem metadata
      const problemMetadata = {
        title: questionTitle,
        description: questionDescription,
        difficulty: difficultyElement?.getAttribute('data-difficulty') || 'Unknown',
        url: window.location.href,
        timestamp: new Date().toISOString(),
        testCases: testcasesElement ? parseTestCases(testcasesElement) : [],
        tags: getQuestionTags(),
        constraints: extractConstraints(descriptionElement)
      };

      // Send the enhanced data to background script
      chrome.runtime.sendMessage({
        action: 'setQuestion',
        question: problemMetadata
      }, (response) => {
        if (response?.status === 'success') {
          console.log('Problem data successfully captured and sent.');
        } else {
          console.warn('Response status not successful:', response);
        }
      });

      // Listen for code changes
      observeCodeChanges();
    } else {
      console.warn('Some question elements not found. Title:', !!titleElement, 'Description:', !!descriptionElement);
    }
  } catch (error) {
    console.error('Error in content script:', error);
  }
});

// Helper function to extract question tags
function getQuestionTags() {
  const tagElements = document.querySelectorAll('[data-track-load="tag-item"]');
  return Array.from(tagElements).map(tag => tag.innerText.trim());
}

// Helper function to parse test cases
function parseTestCases(testcasesElement) {
  const testCases = [];
  const codeBlocks = testcasesElement.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    if (block.textContent.includes('Input:') || block.textContent.includes('Output:')) {
      testCases.push(block.textContent.trim());
    }
  });
  
  return testCases;
}

// Helper function to extract constraints
function extractConstraints(descriptionElement) {
  const constraints = [];
  const elements = descriptionElement.querySelectorAll('p, li');
  
  elements.forEach(el => {
    const text = el.textContent.trim();
    if (text.includes('Constraints:') || 
        text.includes('≤') || 
        text.includes('<=') ||
        text.match(/^\d+\s*<=?\s*\w+\s*<=?\s*\d+$/)) {
      constraints.push(text);
    }
  });
  
  return constraints;
}

// Observe code changes in the editor
function observeCodeChanges() {
  const codeEditor = document.querySelector('[data-track-load="code-editor"]');
  if (!codeEditor) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        chrome.runtime.sendMessage({
          action: 'codeUpdate',
          code: codeEditor.textContent
        });
      }
    });
  });

  observer.observe(codeEditor, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getQuestionDetails') {
    const details = {
      title: document.querySelector('.text-title-large.font-semibold.text-text-primary')?.innerText,
      url: window.location.href,
      timeStamp: new Date().toISOString()
    };
    sendResponse(details);
    return true;
  }
});