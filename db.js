require("dotenv").config();
const mysql = require("mysql2/promise");

['DB_HOST','DB_USER','DB_PASSWORD','DB_NAME'].forEach((v) => {
  if (!process.env[v]) console.error(`⚠️ Missing ${v} in .env.local`);
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  debug: process.env.DB_DEBUG === 'true'
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`Connected to MySQLDB: ${process.env.DB_NAME}`);
    conn.release();
  } catch (err) {
    console.error("MySQLDB connection failed:", err.message);
  }
})();

module.exports = pool;