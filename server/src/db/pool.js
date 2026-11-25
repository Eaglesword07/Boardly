import pg from "pg";

// Create a new PostgreSQL connection pool using the connection string from environment variables
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});