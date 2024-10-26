// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendQuestionToChat') {
    const userMessage = message.question;

    // Send question to chat API
    fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'hwm:latest',
        prompt: userMessage,
        stream: false,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Send the response back to the popup or chat window
        chrome.runtime.sendMessage({
          action: 'displayChatResponse',
          response: data
        });
        sendResponse({ success: true, response: data });
      })
      .catch(error => {
        console.error('Error sending question to chat:', error);
        sendResponse({ success: false, error });
      });

    return true; // Keep the messaging channel open for async sendResponse
  }
});
