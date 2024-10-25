document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
  
    const OLLAMA_API_URL = "http://localhost:11434/api/generate"; // Your backend URL
  
    // Function to render message
    function renderMessage(role, content) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", role === "assistant" ? "assistant" : "user");
      messageElement.textContent = content;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    // Function to handle form submission
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userMessage = chatInput.value.trim();
      if (!userMessage) return;
  
      // Render user message
      renderMessage("user", userMessage);
      
      // Clear input field
      chatInput.value = "";
  
      // Send message to server
      try {
        const response = await fetch(OLLAMA_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: 'hwm:latest',
            messages: [{ role: "user", content: userMessage }],
            stream: true,
          }),
        });
  
        if (!response.ok) throw new Error("Failed to get response from server");
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
  
        let messageContent = "";
  
        // Process the response stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const chunk = decoder.decode(value);
          messageContent += chunk;
  
          // Render assistant message progressively
          renderMessage("assistant", messageContent);
        }
      } catch (error) {
        console.error("Error:", error);
        renderMessage("assistant", "Sorry, something went wrong.");
      }
    });
  });
  