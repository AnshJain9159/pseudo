const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Add body parser middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

app.post('/api/generate', async (req, res) => {
  try {
    console.log('Processing request with body:', req.body);

    // Prepare the request body for Ollama
    const ollamaBody = {
      model: req.body.model,
      stream: true
    };

    // Handle different input formats
    if (req.body.messages) {
      // If using the messages format, take the content from the last message
      ollamaBody.prompt = req.body.messages[req.body.messages.length - 1].content;
    } else if (req.body.prompt) {
      // If using direct prompt format
      ollamaBody.prompt = req.body.prompt;
    } else {
      throw new Error('No prompt or messages found in request');
    }

    console.log('Sending to Ollama:', ollamaBody);

    const response = await axios({
      method: 'post',
      url: 'http://localhost:11434/api/generate',
      data: ollamaBody,
      responseType: 'stream'
    });

    console.log('Received response from Ollama');

    // Set headers
    res.setHeader('Content-Type', 'application/json');
    
    // Process the stream
    response.data.on('data', chunk => {
      console.log('Received chunk:', chunk.toString());
      res.write(chunk);
    });

    response.data.on('end', () => {
      console.log('Stream ended');
      res.end();
    });

    response.data.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Stream error', details: error.message });
      }
    });

  } catch (error) {
    console.error('Proxy Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Proxy server error',
        details: error.message,
        status: error.response?.status
      });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Available at http://localhost:3001/api/generate');
});