import * as listsDb from "../db/lists.js";
import * as boardsDb from "../db/boards.js";
import { isValidTitle, parseId } from "../utils/validate.js";

export async function getLists(req, res) {
  const boardId = parseId(req.params.boardId);
  if (boardId === null) {
    return res.status(404).json({ error: "Board not found" });
  }
  const board = await boardsDb.getBoardById(boardId, req.userId);
  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }
  const lists = await listsDb.getListsByBoard(boardId);
  res.json(lists);
}

export async function createList(req, res) {
  const boardId = parseId(req.params.boardId);
  const { title } = req.body ?? {};
  if (boardId === null) {
    return res.status(404).json({ error: "Board not found" });
  }
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "A title is required" });
  }
  const board = await boardsDb.getBoardById(boardId, req.userId);
  if (!board) {
    return res.status(404).json({ error: "Board not found" });
  }
  const list = await listsDb.createList(boardId, title.trim());
  res.status(201).json(list);
}

export async function updateList(req, res) {
  const id = parseId(req.params.id);
  const { title } = req.body ?? {};
  if (id === null) {
    return res.status(404).json({ error: "List not found" });
  }
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "A title is required" });
  }
  const list = await listsDb.updateList(id, title.trim(), req.userId);
  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }
  res.json(list);
}

export async function deleteList(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ error: "List not found" });
  }
  const deleted = await listsDb.deleteList(id, req.userId);
  if (!deleted) {
    return res.status(404).json({ error: "List not found" });
  }
  res.status(204).send();
}