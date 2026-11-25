import { pool } from "./pool.js";

const USER_COLUMNS = `id, email, name, created_at AS "createdAt"`;
const USER_WITH_PASSWORD_COLUMNS = `id, email, name, password_hash AS "passwordHash"`;

export async function createUser(email, name, passwordHash) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${USER_COLUMNS}`,
    [email, name, passwordHash]
  );
  return rows[0];
}

export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT ${USER_WITH_PASSWORD_COLUMNS}
     FROM users WHERE email = $1`,
    [email]
  );
  return rows[0];
}