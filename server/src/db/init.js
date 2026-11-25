import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pool } from "./pool.js";

// Initialize the database by applying the schema from schema.sql
const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
await pool.query(sql);
console.log("Schema applied");
await pool.end();;