const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Configure the connection pool to your PostgreSQL database using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  //   password: "L0renzo07!",
  port: process.env.DB_PORT,
});

// Function to connect and query the database
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

// Export the query function for use in other modules
module.exports = { query };
