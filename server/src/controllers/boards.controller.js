import * as db from "../db/memory.js";

function isValidTitle(title) {
    return typeof title === "string" && title.trim() !== "";
}

export function listBoards(req, res) {
    res.json(db.getAllBoards());
}

export function getBoard(req, res) {
    const board = db.getBoardById(Number(req.params.id));
    if (!board) {
        return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
}

export function createBoard(req, res) {
    const { title } = req.body ?? {};
    if (!isValidTitle(title)) {
        return res.status(400).json({ error: "A title is required" });
    }
    const board = db.createBoard(title);
    res.status(201).json(board);
}

export function updateBoard(req, res) {
    const { title } = req.body ?? {};
    if (!isValidTitle(title)) {
        return res.status(400).json({ error: "A title is required" });
    }
    const board = db.updateBoard(Number(req.params.id), title);
    if (!board) {
        return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
}

export function deleteBoard(req, res) {
    const deleted = db.deleteBoard(Number(req.params.id));
    if (!deleted) {
        return res.status(404).json({ error: "Board not found" });
    }
    res.status(204).send();
}