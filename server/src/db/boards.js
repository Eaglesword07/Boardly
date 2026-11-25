import { pool } from "./pool.js";

const BOARD_COLUMNS = `id, title, created_at AS "createdAt"`;

// Database functions for interacting with boards table
export async function getAllBoards(ownerId) {
  const { rows } = await pool.query(
    `SELECT ${BOARD_COLUMNS} FROM boards WHERE owner_id = $1 ORDER BY id`,
    [ownerId]
  );
  return rows;
}

export async function getBoardById(id, ownerId) {
  const { rows } = await pool.query(
    `SELECT ${BOARD_COLUMNS} FROM boards WHERE id = $1 AND owner_id = $2`,
    [id, ownerId]
  );
  return rows[0];
}

export async function createBoard(title, ownerId) {
  const { rows } = await pool.query(
    `INSERT INTO boards (title, owner_id) VALUES ($1, $2) RETURNING ${BOARD_COLUMNS}`,
    [title, ownerId]
  );
  return rows[0];
}

export async function updateBoard(id, title, ownerId) {
  const { rows } = await pool.query(
    `UPDATE boards SET title = $1 WHERE id = $2 AND owner_id = $3 RETURNING ${BOARD_COLUMNS}`,
    [title, id, ownerId]
  );
  return rows[0];
}

export async function deleteBoard(id, ownerId) {
  const result = await pool.query(
    "DELETE FROM boards WHERE id = $1 AND owner_id = $2",
    [id, ownerId]
  );
  return result.rowCount > 0;
}