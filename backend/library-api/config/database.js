const { Pool } = require('pg');

// Database configuration for nara_library
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nara_library',
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Get a client from the pool
async function getClient() {
  return await pool.connect();
}

// Test database connection
async function testConnection() {
  try {
    const client = await getClient();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully at', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  pool,
  getClient,
  testConnection
};
