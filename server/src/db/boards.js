import { pool } from "./pool.js";

const BOARD_COLUMNS = `id, title, created_at AS "createdAt"`;

// Database functions for interacting with the boards table
export async function getAllBoards() {
    const { rows } = await pool.query(
        `SELECT ${BOARD_COLUMNS} FROM boards ORDER BY id`
    );
    return rows;
}

export async function getBoardById(id) {
    const { rows } = await pool.query(
        `SELECT ${BOARD_COLUMNS} FROM boards WHERE id = $1`,
        [id]
    );
    return rows[0];
}

export async function createBoard(title) {
    const { rows } = await pool.query(
        `INSERT INTO boards (title) VALUES ($1) RETURNING ${BOARD_COLUMNS}`,
        [title]
    );
    return rows[0];
}

export async function updateBoard(id, title) {
    const { rows } = await pool.query(
        `UPDATE boards SET title = $1 WHERE id = $2 RETURNING ${BOARD_COLUMNS}`,
        [title, id]
    );
    return rows[0];
}

export async function deleteBoard(id) {
    const result = await pool.query(
        `DELETE FROM boards WHERE id =$1`,
        [id]
    );
    return result.rowCount > 0;
}