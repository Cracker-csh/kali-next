/**
 * AI Assistant Routes
 * Handles communication with Google Gemini API
 */

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_INSTRUCTION = "You are CyberShield AI, a helpful and ethical cybersecurity assistant. Your goal is to help students learn about cybersecurity concepts, Kali Linux tools, and best practices. Always prioritize ethical guidelines and educational content. Do not provide information on how to perform illegal activities. Keep your responses concise and well-formatted using markdown.";

// Helper: create a fresh model instance using the current env key
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = getModel();
    if (!model) {
      return res.json({
        success: true,
        response: "SYSTEM: GEMINI_API_KEY not found in .env. Please add your API key from Google AI Studio to enable the Neural Core.\n\nIn the meantime, I am limited to basic simulated responses. Please configure the environment to proceed."
      });
    }

    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${prompt}`;

    // Retry logic for rate limiting (up to 3 attempts)
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        return res.json({ success: true, response: text });
      } catch (err) {
        if (err.status === 429 && attempt < 2) {
          // Rate limited — wait and retry
          console.log(`Rate limited, retrying in ${(attempt + 1) * 5}s... (attempt ${attempt + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 5000));
          continue;
        }
        throw err;
      }
    }

  } catch (error) {
    console.error('AI API Error:', error.message || error);

    let userMessage = 'Failed to process AI request.';
    if (error.status === 429) {
      userMessage = 'Rate limit reached. The free tier has request limits — please wait a minute and try again.';
    } else if (error.status === 403) {
      userMessage = 'API key is invalid or does not have permission. Please check your GEMINI_API_KEY in .env.';
    } else if (error.status === 404) {
      userMessage = 'AI model not found. Please check server configuration.';
    } else if (error.message?.includes('API_KEY_INVALID')) {
      userMessage = 'API key is invalid. Please generate a new key from Google AI Studio.';
    }

    res.status(500).json({ success: false, error: userMessage });
  }
});

module.exports = router;
