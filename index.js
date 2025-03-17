const express = require('express');
const translatte = require('translatte');
const cors = require('cors');

const app = express();
const PORT = 5001; // Updated port to 5001

// Middleware
app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
    const { text, targetLang } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided for translation.' });
    }

    try {
        const result = await translatte(text, { to: targetLang });

        if (result.text) {
            res.json({ translatedText: result.text });
        } else {
            res.status(500).json({ error: 'Translation API returned no text.' });
        }
    } catch (error) {
        if (error.google_free && error.google_free === 'Could not get token from google') {
            res.status(500).json({ error: 'Google Translate token error. Try again later.' });
        } else {
            console.error("Translation error:", error);
            res.status(500).json({ error: 'Translation failed', details: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
// This is a test comment to trigger Git.