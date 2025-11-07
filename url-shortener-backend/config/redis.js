// config/redis.js
const Redis = require('ioredis');
require('dotenv').config();

// Use TLS connection for Redis Cloud
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on('connect', () => console.log('✅ Redis connected successfully'));
redis.on('error', (err) => console.error('❌ Redis connection error:', err.message));

module.exports = redis;
