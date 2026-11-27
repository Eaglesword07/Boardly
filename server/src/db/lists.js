import { pool } from "./pool.js";

const LIST_COLUMNS = `id, board_id AS "boardId", title, position`;

export async function getListsByBoard(boardId) {
  const { rows } = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM lists WHERE board_id = $1 ORDER BY position`,
    [boardId]
  );
  return rows;
}

export async function getListById(id, ownerId) {
  const { rows } = await pool.query(
    `SELECT l.id, l.board_id AS "boardId", l.title, l.position
     FROM lists l
     JOIN boards b ON b.id = l.board_id
     WHERE l.id = $1 AND b.owner_id = $2`,
    [id, ownerId]
  );
  return rows[0];
}

export async function createList(boardId, title) {
  const { rows } = await pool.query(
    `INSERT INTO lists (board_id, title, position)
     VALUES (
       $1,
       $2,
       COALESCE((SELECT MAX(position) FROM lists WHERE board_id = $1), 0) + 1
     )
     RETURNING ${LIST_COLUMNS}`,
    [boardId, title]
  );
  return rows[0];
}

export async function updateList(id, title, ownerId) {
  const { rows } = await pool.query(
    `UPDATE lists SET title = $1
     WHERE id = $2
       AND board_id IN (SELECT id FROM boards WHERE owner_id = $3)
     RETURNING ${LIST_COLUMNS}`,
    [title, id, ownerId]
  );
  return rows[0];
}

export async function deleteList(id, ownerId) {
  const result = await pool.query(
    `DELETE FROM lists
     WHERE id = $1
       AND board_id IN (SELECT id FROM boards WHERE owner_id = $2)`,
    [id, ownerId]
  );
  return result.rowCount > 0;
}