import * as db from "../db/boards.js";

// Helper functions for validating input and parsing IDs
function isValidTitle(title) {
  return typeof title === "string" && title.trim() !== "";
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

// Controller functions for handling board-related requests
export async function listBoards(req, res) {
  const boards = await db.getAllBoards();
  res.json(boards);
}

export async function getBoard(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ error: "Board id not found" });
  }
  const board = await db.getBoardById(id);
  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }
  res.json(board);
}

export async function createBoard(req, res) {
  const { title } = req.body ?? {};
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "A title is required" });
  }
  const board = await db.createBoard(title.trim());
  res.status(201).json(board);
}

export async function updateBoard(req, res) {
  const id = parseId(req.params.id);
  const { title } = req.body ?? {};
  if (id === null) {
    return res.status(404).json({ error: "Board not found" });
  }
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "A title is required" });
  }
  const board = await db.updateBoard(id, title.trim());
  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }
  res.json(board);
}

export async function deleteBoard(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ error: "Board not found" });
  }
  const deleted = await db.deleteBoard(id);
  if (!deleted) {
    return res.status(404).json({ error: "Board not found" });
  }
  res.status(204).send();
}