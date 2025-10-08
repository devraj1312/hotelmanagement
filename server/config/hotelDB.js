import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const connectHotelDB = ({ db_name, db_user, db_password, db_host, db_port }) => {
  if (!db_name || !db_user || !db_password) {
    throw new Error("Missing database connection parameters.");
  }

  return new Pool({
    host: db_host || process.env.DB_HOST,
    user: db_user,
    password: db_password,
    database: db_name,
    port: db_port || parseInt(process.env.DB_PORT, 10) || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
};
