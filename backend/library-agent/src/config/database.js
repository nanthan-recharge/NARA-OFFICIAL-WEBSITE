const { Pool } = require('pg');
const config = require('./index');
const logger = require('./logger');

// PostgreSQL connection pool
const pool = new Pool(config.postgres);

// Test database connection
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool (for transactions)
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Test connection function
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    logger.info('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error.message);
    return false;
  }
};

// Close pool
const close = async () => {
  await pool.end();
  logger.info('PostgreSQL pool closed');
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  close
};

