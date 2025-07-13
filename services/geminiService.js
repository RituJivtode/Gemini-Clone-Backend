const axios = require('axios');
const { Message } = require('../models');

exports.handleGeminiMessage = async (messageId, prompt) => {
  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const geminiText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    console.log('geminiText 21: ', geminiText)
    
    await Message.update({ response: geminiText }, { where: { id: messageId } });
  } catch (error) {
    const status = error?.response?.status;

    if (status === 429) {
      console.warn('Gemini quota exceeded. Using fallback.');
      await Message.update(
        { response: 'Gemini quota exceeded. Please try again later.' },
        { where: { id: messageId } }
      );
    } else {
      console.error('Gemini API Error:', error?.response?.data || error.message);
      await Message.update(
        { response: `Error: Gemini API failed (${status || 'unknown'})` },
        { where: { id: messageId } }
      );
    }
  }
};
