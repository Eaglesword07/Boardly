import * as db from "../db/boards.js";
import * as listsDb from "../db/lists.js";
import * as cardsDb from "../db/cards.js";
import { isValidTitle, parseId } from "../utils/validate.js";

// Controller functions for handling board-related requests
export async function listBoards(req, res) {
  const boards = await db.getAllBoards(req.userId);
  res.json(boards);
}

export async function getBoard(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ error: "Board id not found" });
  }
  const board = await db.getBoardById(id, req.userId);
  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }
  const lists = await listsDb.getListsByBoard(id);
  const cards = await cardsDb.getCardsByBoard(id);

  const listsWithCards = lists.map((list) => ({
    ...list,
    cards: cards.filter((card) => card.listId === list.id),
  }));

  res.json({ ...board, lists: listsWithCards });
}

export async function createBoard(req, res) {
  const { title } = req.body ?? {};
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "A title is required" });
  }
  const board = await db.createBoard(title.trim(), req.userId);
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
  const board = await db.updateBoard(id, title.trim(), req.userId);
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
  const deleted = await db.deleteBoard(id, req.userId);
  if (!deleted) {
    return res.status(404).json({ error: "Board not found" });
  }
  res.status(204).send();
}