import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a new pool for Admin DB
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // admin db name
  port: process.env.DB_PORT,
  max: 10,                       // max connections
  idleTimeoutMillis: 30000,      // close idle clients after 30s
  connectionTimeoutMillis: 5000, // timeout if cannot connect
});

// Handle unexpected errors
pool.on('error', (err) => {
  console.error('❌ Unexpected DB error:', err);
  process.exit(1);
});

export const adminDB = pool;
