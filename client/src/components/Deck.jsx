import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Card from './CardComponent';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const generateDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const Deck = ({inputMode}) => {
  const [aiHand, setAiHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [deckCard, setDeckCard] = useState({ value: '?', suit: '?' });
  const [mode, setMode] = useState(inputMode)

  useEffect(() => {
    const fullDeck = shuffle(generateDeck());
    setAiHand(fullDeck.slice(0, 6));
    setPlayerHand(fullDeck.slice(6, 12));
  }, []);

  return (
    <Container fluid className="d-flex flex-column align-items-center justify-content-between" style={{ minHeight: '70vh' }}>
      
      <div>Opponent</div>
      <div className="d-flex justify-content-center mb-4" style={{ minHeight: '6rem' }}>
        {aiHand.map((card, idx) => (
          <Card key={idx} value="?" suit="?" />
        ))}
      </div>

      <div className="mb-4">
        <Card value={deckCard.value} suit={deckCard.suit} />
      </div>

      <div className="d-flex justify-content-center mt-4">
        {playerHand.map((card, idx) => (
          <Card key={idx} value={card.value} suit={card.suit} />
        ))}
      </div>
      <div>Your Cards</div>
    </Container>
  );
};

export default Deck;