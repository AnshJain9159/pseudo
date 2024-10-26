// chatbot.js
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  function renderMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", role === "assistant" ? "assistant" : "user");
    messageElement.textContent = content;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Listen for responses from background.js to display in chat
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'displayChatResponse' && message.response) {
      renderMessage("assistant", message.response.data);
    }
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Render user message
    renderMessage("user", userMessage);
    chatInput.value = "";

    chrome.runtime.sendMessage({
      action: 'sendQuestionToChat',
      question: userMessage
    });
  });
});
