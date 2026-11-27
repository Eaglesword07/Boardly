import * as cardsDb from "../db/cards.js";
import * as listsDb from "../db/lists.js";
import { isValidTitle, parseId } from "../utils/validate.js";

export async function createCard(req, res) {
  const listId = parseId(req.params.listId);
  const { title, description = "" } = req.body ?? {};

  if (listId === null) {
    return res.status(404).json({ error: "List not found" });
  }
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "A title is required" });
  }
  if (typeof description !== "string") {
    return res.status(400).json({ error: "Description must be text" });
  }

  const list = await listsDb.getListById(listId, req.userId);
  if (!list) {
    return res.status(404).json({ error: "List not found" });
  }

  const card = await cardsDb.createCard(listId, title.trim(), description);
  res.status(201).json(card);
}

export async function updateCard(req, res) {
  const id = parseId(req.params.id);
  const { title, description } = req.body ?? {};

  if (id === null) {
    return res.status(404).json({ error: "Card not found" });
  }
  if (title === undefined && description === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  if (title !== undefined && !isValidTitle(title)) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ error: "Description must be text" });
  }

  const card = await cardsDb.updateCard(id, title?.trim(), description, req.userId);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.json(card);
}

export async function deleteCard(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(404).json({ error: "Card not found" });
  }
  const deleted = await cardsDb.deleteCard(id, req.userId);
  if (!deleted) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.status(204).send();
}