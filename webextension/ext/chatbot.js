document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  const OLLAMA_API_URL = "http://localhost:3001/api/generate";

  function renderMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", role === "assistant" ? "assistant" : "user");
    messageElement.textContent = content;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Render user message
    renderMessage("user", userMessage);
    chatInput.value = "";

    try {
      console.log('Sending request to:', OLLAMA_API_URL);
      
      const response = await fetch(OLLAMA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "hwm:latest", // Changed from hwm:latest
          prompt: userMessage, // Using prompt instead of messages
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = document.createElement("div");
      assistantMessage.classList.add("message", "assistant");
      chatMessages.appendChild(assistantMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        console.log('Received chunk:', chunk);
        
        try {
          const lines = chunk.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              assistantMessage.textContent += parsed.response;
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
          assistantMessage.textContent += chunk;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      renderMessage("assistant", `Error: ${error.message}`);
    }
  });
});