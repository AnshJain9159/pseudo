const fs = require('fs');
const axios = require('axios');

const svgFilePath = 'work3.svg';
const outputFilePath = 'response.txt';
//svg file ko text ki tarah read kro
fs.readFile(svgFilePath, 'utf8', async (err, svgData) => {
  if (err) {
    console.error("Error reading the file", err);
    return;
  }

  // Prepare the request payload
  const payload = {
    model: 'hwm:latest', 
    prompt: svgData,
  };

  try {
    const response = await axios.post('http://localhost:11434/api/generate', payload, {
      responseType: 'stream'
    });

    let fullResponse = '';

    //sare responses me se sirf response ko ek string me concat karke text file me save

    response.data.on('data', (chunk) => {
      const jsonChunk = JSON.parse(chunk);
      fullResponse += jsonChunk.response;
    });

    // When the response stream is done, write to the text file
    response.data.on('end', () => {
      fs.writeFile(outputFilePath, fullResponse, (err) => {
        if (err) {
          console.error("Error writing to the file", err);
          return;
        }
        console.log(`Concatenated response written to ${outputFilePath}`);
      });
    });

  } catch (error) {
    console.error("Error communicating with the model:", error.message);
  }
});
