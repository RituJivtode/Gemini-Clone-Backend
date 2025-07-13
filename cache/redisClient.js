// const Redis = require('ioredis');
// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
// module.exports = redis;

const { createClient } = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect();

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis Error:', err));

module.exports = redis;
