import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Card from './CardComponent';
import { initGame, askForCard, drawCard, checkForBooks } from '../GameEngine';

export const Deck = ({inputMode}) => {
    const [game, setGame] = useState(null);
    const [aiHand, setAiHand] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [deckCard, setDeckCard] = useState({ value: '?', suit: '?' });
    const [mode, setMode] = useState(inputMode)

    useEffect(() => {
        setGame(initGame());
    }, []);

    if (!game) return <div>Loading...</div>;

    const handleAsk = (value) => {
        const { success, fromHand, toHand } = askForCard(game.playerHand, game.opponentHand, value);
        let newPlayerHand = fromHand;
        let newOpponentHand = toHand;
        let newDeck = game.deck;
    
        if (!success) {
            const drawResult = drawCard(newPlayerHand, newDeck);
            newPlayerHand = drawResult.hand;
            newDeck = drawResult.deck;
        }
        const { books, remainingHand } = checkForBooks(newPlayerHand);

        setGame({
            ...game,
            playerHand: remainingHand,
            opponentHand: newOpponentHand,
            playerBooks: [...game.playerBooks, ...books],
            deck: newDeck,
            currentPlayer: 'opponent',
        });
    };

    return (
        <Container fluid className="d-flex flex-column align-items-center justify-content-between" style={{ minHeight: '70vh' }}>
          
          <div>Opponent</div>
          <div className="d-flex justify-content-center mb-4" style={{ minHeight: '6rem' }}>
            {game.opponentHand.map((_, idx) => (
              <Card key={idx} value="?" suit="?" />
            ))}
          </div>
    
          <div className="mb-4">
            {game.deck.length > 0 ? (
              <Card value="?" suit="?" />
            ) : (
              <div>No Cards Left</div>
            )}
          </div>
    
          <div className="d-flex justify-content-center mt-4 flex-wrap">
            {game.playerHand.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(card.value)}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <Card value={card.value} suit={card.suit} />
              </button>
            ))}
          </div>
          <div>Your Cards</div>
    
          <div className="mt-3">
            <strong>Your Books:</strong> {game.playerBooks.join(', ') || 'None'}
          </div>
        </Container>
      );
    };
    

export default Deck;