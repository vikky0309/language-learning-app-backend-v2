const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({
      error: 'Text and target language are required.',
    });
  }

  const encodedParams = new URLSearchParams();
  encodedParams.set('text', text);
  encodedParams.set('target_language', targetLang);

  const options = {
    method: 'POST',
    url: 'https://text-translator2.p.rapidapi.com/translate',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);

    return res.json(response.data);
  } catch (error) {
    console.error(
      'Error during translation:',
      error.message
    );
    return res
      .status(500)
      .json({ error: 'Translation failed' });
  }
});

app.listen(port, () => {
  console.log(
    `Server listening at http://localhost:${port}`
  );
});