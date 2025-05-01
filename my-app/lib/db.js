import { Pool, Client } from "pg";

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false },
});

// Change URI as needed
const fallbackConnectionString = process.env.DATABASE_URL || "postgresql://postgres:bruh@localhost:5432/DEI_Report";

const con = new Client({
  connectionString: fallbackConnectionString,
  ssl: { rejectUnauthorized: false },
});

export async function connectWithRetry(retries = 5, delay = 2000) {
  while (retries > 0) {
    try {
      await con.connect();
      console.log("Connected to PostgreSQL with retry logic");
      return;
    } catch (err) {
      console.log("Connection failed. Retrying in", delay / 1000, "sec...");
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

connectWithRetry();
