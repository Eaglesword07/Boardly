import { pool } from "./pool.js";

const CARD_COLUMNS = `id, list_id AS "listId", title, description, position`;

const OWNED_LISTS = `
  SELECT l.id FROM lists l
  JOIN boards b ON b.id = l.board_id
  WHERE b.owner_id =`;

export async function getCardsByBoard(boardId) {
  const { rows } = await pool.query(
    `SELECT c.id, c.list_id AS "listId", c.title, c.description, c.position
     FROM cards c
     JOIN lists l ON l.id = c.list_id
     WHERE l.board_id = $1
     ORDER BY c.position`,
    [boardId]
  );
  return rows;
}

export async function createCard(listId, title, description) {
  const { rows } = await pool.query(
    `INSERT INTO cards (list_id, title, description, position)
     VALUES (
       $1, $2, $3,
       COALESCE((SELECT MAX(position) FROM cards WHERE list_id = $1), 0) + 1
     )
     RETURNING ${CARD_COLUMNS}`,
    [listId, title, description]
  );
  return rows[0];
}

export async function updateCard(id, title, description, ownerId) {
  const { rows } = await pool.query(
    `UPDATE cards
     SET title = COALESCE($1, title),
         description = COALESCE($2, description)
     WHERE id = $3
       AND list_id IN (${OWNED_LISTS} $4)
     RETURNING ${CARD_COLUMNS}`,
    [title, description, id, ownerId]
  );
  return rows[0];
}

export async function deleteCard(id, ownerId) {
  const result = await pool.query(
    `DELETE FROM cards
     WHERE id = $1
       AND list_id IN (${OWNED_LISTS} $2)`,
    [id, ownerId]
  );
  return result.rowCount > 0;
}