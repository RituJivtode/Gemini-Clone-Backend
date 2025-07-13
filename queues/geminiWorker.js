const { Worker } = require('bullmq');
const { handleGeminiMessage } = require('../services/geminiService');

new Worker('gemini-message', async job => {
  console.log('🌀 Processing Gemini job 9:', job.data);
  const { messageId, prompt } = job.data;
  await handleGeminiMessage(messageId, prompt);
}, {
  connection: { host: '127.0.0.1', port: 6379 }
});


