const { Queue } = require('bullmq');

const geminiQueue = new Queue('gemini-message', {
  connection: { host: '127.0.0.1', port: 6379 }
});

module.exports = geminiQueue;
