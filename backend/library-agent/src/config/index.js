require('dotenv').config();

const requiredVars = ['DB_HOST', 'DB_NAME', 'REDIS_HOST', 'FIREBASE_STORAGE_BUCKET'];
for (const envVar of requiredVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  
  postgres: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
  },
  
  firebase: {
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  },
  
  worker: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY, 10) || 5,
    maxRetries: parseInt(process.env.MAX_RETRIES, 10) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY, 10) || 5000
  },
  
  api: {
    delayMs: parseInt(process.env.API_DELAY_MS, 10) || 2000,
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 30000
  },
  
  download: {
    booksPerCategory: parseInt(process.env.BOOKS_PER_CATEGORY, 10) || 10,
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 50
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

