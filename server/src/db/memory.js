let nextId = 1;
const boards = [];

export function getAllBoards() {
    return boards;
}

export function getBoardById(id) {
    return boards.find((board) => board.id === id);
}

export function createBoard(title) {
    const board = { id: nextId++, title, createdAt: new Date().toDateString() };
    boards.push(board);
    return board;
}

export function updateBoard(id, title) {
    const board = getBoardById(id);
    if (!board) return undefined;
    board.title = title;
    return board;
}

export function deleteboard(id) {
    const index = boards.findIndex((board) => board.id === id);
    if (index === -1) return false;
    boards.splice(index, 1);
    return true;
}
