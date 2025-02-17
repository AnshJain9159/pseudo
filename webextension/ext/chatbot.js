document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const OLLAMA_API_URL = "http://localhost:3001/api/generate";

  // Function to format code blocks with syntax highlighting
  function formatCodeBlocks(content) {
    // Replace code blocks with proper formatting
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
      return `<pre><code class="language-${language || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // Format Input/Output blocks specially
    content = content.replace(/Input:(.*?)(?=Output:|$)/gs, (match, input) => {
      return `<div class="io-block"><strong>Input:</strong> <code>${input.trim()}</code></div>`;
    });
    content = content.replace(/Output:(.*?)(?=\n\n|$)/gs, (match, output) => {
      return `<div class="io-block"><strong>Output:</strong> <code>${output.trim()}</code></div>`;
    });
    
    // Replace inline code
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return content;
  }

  // Function to format markdown with enhanced styling
  function formatMarkdown(content) {
    // Bold with proper spacing
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Lists with proper indentation and bullets
    content = content.replace(/^\s*•\s(.*)$/gm, '<li class="bullet">$1</li>');
    content = content.replace(/(<li.*>.*<\/li>\n?)+/g, '<ul class="custom-list">$&</ul>');
    
    // Headers with proper spacing
    content = content.replace(/^###\s(.*)$/gm, '<h3 class="markdown-h3">$1</h3>');
    content = content.replace(/^##\s(.*)$/gm, '<h2 class="markdown-h2">$1</h2>');
    content = content.replace(/^#\s(.*)$/gm, '<h1 class="markdown-h1">$1</h1>');
    
    // Format examples with special styling
    content = content.replace(/\*\*Example \d+:\*\*/g, '<div class="example-header">$&</div>');
    
    // Format constraints with special styling
    content = content.replace(/\*\*Constraints:\*\*/g, '<div class="constraints-header">$&</div>');
    
    return content;
  }

  // Add custom styles for the formatted elements
  const customStyles = document.createElement('style');
  customStyles.textContent = `
    .io-block {
      margin: 8px 0;
      padding: 8px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
    }
    
    .io-block code {
      color: #a5f3fc;
      background: none;
      padding: 0;
    }
    
    .custom-list {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .bullet {
      list-style-type: none;
      position: relative;
      padding-left: 15px;
    }
    
    .bullet:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #6366f1;
    }
    
    .example-header {
      margin: 16px 0 8px 0;
      color: #818cf8;
      font-weight: 600;
    }
    
    .constraints-header {
      margin: 16px 0 8px 0;
      color: #818cf8;
      font-weight: 600;
    }
    
    .markdown-h1, .markdown-h2, .markdown-h3 {
      margin: 16px 0 8px 0;
      color: #ffffff;
      font-weight: 600;
    }
  `;
  document.head.appendChild(customStyles);

  function renderMessage(role, content) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", role === "assistant" ? "assistant" : "user");
    
    // Format the content
    let formattedContent = content;
    formattedContent = formatCodeBlocks(formattedContent);
    formattedContent = formatMarkdown(formattedContent);
    
    // Handle newlines while preserving formatting
    formattedContent = formattedContent.replace(/\n\n/g, '<br><br>');
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    messageElement.innerHTML = formattedContent;
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
          model: "hwm:latest",
          prompt: userMessage,
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
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        
        try {
          const lines = chunk.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullResponse += parsed.response;
              // Format and update the message
              let formattedResponse = formatCodeBlocks(fullResponse);
              formattedResponse = formatMarkdown(formattedResponse);
              formattedResponse = formattedResponse.replace(/\n/g, '<br>');
              assistantMessage.innerHTML = formattedResponse;
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
          fullResponse += chunk;
          assistantMessage.innerHTML = fullResponse;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      renderMessage("assistant", `Error: ${error.message}`);
    }
  });
});