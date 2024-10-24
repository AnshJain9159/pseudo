// background.js
let currentQuestion = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setQuestion') {
    currentQuestion = request.question;
    sendResponse({ status: 'success' });
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (currentQuestion) {
    navigator.clipboard.writeText(currentQuestion).then(() => {
      console.log('Question copied to clipboard successfully! Now go to the Socrate');
    }).catch(err => {
      console.error('Failed to copy question: ', err);
    });
  } else {
    console.log('No question to copy.');
  }
});
