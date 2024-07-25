const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual RapidAPI key
const rapidApiKey = '6a381d6a7bmsh822a533b6f6dbfdp1530dbjsn38b24a6d2e6c';
const gpt3ApiHost = 'chatgpt-api8.p.rapidapi.com';

app.use(cors()); // Enable CORS

// /gpt3 endpoint
app.get('/gpt3', (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required' });
  }

  const options = {
    method: 'POST',
    hostname: gpt3ApiHost,
    path: '/',
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': gpt3ApiHost,
      'Content-Type': 'application/json'
    }
  };

  const apiReq = https.request(options, apiRes => {
    let chunks = [];

    apiRes.on('data', chunk => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      const response = JSON.parse(body.toString());
      res.json(response);
    });
  });

  apiReq.on('error', error => {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  });

  apiReq.write(JSON.stringify([
    {
      content: 'You are a helpful assistant.',
      role: 'system'
    },
    {
      content: prompt,
      role: 'user'
    }
  ]));
  apiReq.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
