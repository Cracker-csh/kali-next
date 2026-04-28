/**
 * AI Assistant Routes
 * Handles communication with LLM (OpenAI API or fallback)
 */

const express = require('express');
const router = express.Router();
// const { Configuration, OpenAIApi } = require('openai'); // Example for OpenAI

// Mock/fallback response logic if no API key is provided
router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // In a real application, you would call OpenAI/Gemini here:
    // const response = await openai.createChatCompletion({ ... });
    
    // For now, we will simulate the AI logic since we might not have a valid key
    setTimeout(() => {
      let aiResponse = "SYSTEM: LLM API Key not detected. Operating in simulated mode.\\n\\n";
      const p = prompt.toLowerCase();
      
      if (p.includes('nmap')) {
        aiResponse += "To perform a stealth scan with Nmap, use the `-sS` flag (TCP SYN scan). Example:\\n`nmap -sS 192.168.1.1`\\nThis requires root privileges because it crafts raw TCP packets.";
      } else if (p.includes('sql')) {
        aiResponse += "SQL Injection (SQLi) is a vulnerability where an attacker can interfere with the queries that an application makes to its database.\\n\\nExample payload: `' OR 1=1--`";
      } else if (p.includes('ping') || p.includes('network')) {
        aiResponse += "Networking commands like `ping` help you verify connectivity. `ping 8.8.8.8` sends ICMP echo requests to Google's public DNS.";
      } else {
        aiResponse += "I'm equipped to explain tools, concepts, and provide syntax examples. Please ask about specific tools or networking concepts!";
      }

      res.json({ success: true, response: aiResponse });
    }, 1000);

  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process AI request' });
  }
});

module.exports = router;
