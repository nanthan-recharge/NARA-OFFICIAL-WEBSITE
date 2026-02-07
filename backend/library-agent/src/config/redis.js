const IORedis = require('ioredis');
const config = require('./index');
const logger = require('./logger');

const connection = new IORedis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
  enableReadyCheck: false,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

connection.on('connect', () => {
  logger.info('Redis connected');
});

connection.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

connection.on('close', () => {
  logger.warn('Redis connection closed');
});

module.exports = connection;

