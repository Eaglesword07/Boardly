import List from "./List.jsx";

function Board({ board }) {
  return (
    <main className="board-page">
      <h1>{board.title}</h1>
      <div className="lists">
        {board.lists.map((list) => (
          <List key={list.id} title={list.title} initialCards={list.cards} />
        ))}
      </div>
    </main>
  );
}

export default Board;