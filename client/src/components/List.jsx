import { useState } from "react";
import Card from "./Card.jsx";

function List({ title, initialCards }) {
  const [cards, setCards] = useState(initialCards);

  function addCard() {
    const newCard = { id: Date.now(), title: "New card" };
    setCards([...cards, newCard]);
  }

  return (
    <section className="list">
      <h2 className="list-title">
        {title} <span className="count">{cards.length}</span>
      </h2>
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}
      <button className="add" onClick={addCard}>
        + Add card
      </button>
    </section>
  );
}

export default List;