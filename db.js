// Enhanced db.js with better error handling
require("dotenv").config();
const mysql = require("mysql2/promise");

// Verify environment variables are set
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file or environment configuration');
  // Don't throw here to allow the app to start, but log clearly
}

// Create connection pool with fallbacks for non-critical options
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306, // Default MySQL port as fallback
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0', 10),
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
  timezone: '+00:00', // Standardize on UTC
  // Debug flag that can be turned on in development
  debug: process.env.DB_DEBUG === 'true' || false
});

// Test the connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: ${process.env.DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error.message);
    // Don't crash the app, but make it clear there's a database problem
  }
})();

module.exports = pool;