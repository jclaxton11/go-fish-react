import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import Card from "./CardComponent";
import {
  initGame,
  askForCard,
  drawCard,
  checkForBooks,
  opponentTurn
} from "../GameEngine";

export const SinglePlayer = ({ inputMode, setGameStarted }) => {
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null); // Track the winner
  const [showModal, setShowModal] = useState(false); // Show the popup
  const [mode, setMode] = useState(inputMode);

  function sortHand(hand) {
    const valueOrder = {
      A: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      J: 11,
      Q: 12,
      K: 13
    };
    return hand.sort((a, b) => valueOrder[a.value] - valueOrder[b.value]);
  }

  useEffect(() => {
    const initialGame = initGame();
    const sortedPlayerHand = sortHand(initialGame.playerHand);
    const sortedOpponentHand = sortHand(initialGame.opponentHand);

    setGame({
      ...initialGame,
      playerHand: sortedPlayerHand,
      opponentHand: sortedOpponentHand
    });
  }, []);

  if (!game) return <div>Loading...</div>;

  const handleAsk = (value) => {
    const { success, fromHand, toHand } = askForCard(
      game.playerHand,
      game.opponentHand,
      value
    );
    let newPlayerHand = fromHand;
    let newOpponentHand = toHand;
    let newDeck = game.deck;

    if (!success) {
      const drawResult = drawCard(newPlayerHand, newDeck);
      newPlayerHand = drawResult.hand;
      newDeck = drawResult.deck;
    }

    const { books: playerBooks, remainingHand: remainingPlayerHand } =
      checkForBooks(newPlayerHand);

    let updatedGame = {
      ...game,
      playerHand: sortHand(remainingPlayerHand),
      opponentHand: sortHand(newOpponentHand),
      playerBooks: [...game.playerBooks, ...playerBooks],
      deck: newDeck,
      currentPlayer: "opponent" // Set the game to the opponent's turn
    };

    // Update UI with player's turn results
    setGame(updatedGame);

    // Check if game ends (any player has no cards left)
    if (
      updatedGame.playerHand.length === 0 ||
      updatedGame.opponentHand.length === 0
    ) {
      endGame(updatedGame);
      return;
    }

    // Trigger AI's turn after a 2-second delay to simulate thinking time
    setTimeout(() => {
      const aiUpdatedGame = opponentTurn(updatedGame);
      aiUpdatedGame.opponentHand = sortHand(aiUpdatedGame.opponentHand);
      setGame(aiUpdatedGame); // Update state with the new opponent hand and deck

      // Check if game ends after AI's turn
      if (
        aiUpdatedGame.playerHand.length === 0 ||
        aiUpdatedGame.opponentHand.length === 0
      ) {
        endGame(aiUpdatedGame); // End the game if any player runs out of cards
      }
    }, 2000);
  };

  const endGame = (finalGameState) => {
    const playerBooksCount = finalGameState.playerBooks.length;
    const opponentBooksCount = finalGameState.opponentBooks.length;
    let winner = "";

    if (playerBooksCount > opponentBooksCount) {
      winner = "Player";
    } else if (playerBooksCount < opponentBooksCount) {
      winner = "AI";
    } else {
      winner = "It's a tie!";
    }

    setWinner(winner);
    setShowModal(true); // Show the winner popup
  };

  const handleRestart = () => {
    setGame(initGame()); // Restart the game
    setShowModal(false);
  };

  const handleReturnHome = () => {
    setGameStarted(false);
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-between"
      style={{ minHeight: "70vh" }}
    >
      <div>Opponent</div>
      <div className="mt-3">
        <strong>Opponent's Books: </strong>
        {game.opponentBooks.join(", ") || "None"}
      </div>
      <div
        className="d-flex justify-content-center mb-4"
        style={{ minHeight: "6rem" }}
      >
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
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <Card value={card.value} suit={card.suit} />
          </button>
        ))}
      </div>
      <div>Your Cards</div>

      <div className="mt-3">
        <strong>Your Books:</strong> {game.playerBooks.join(", ") || "None"}
      </div>

      {/* Modal for end game */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Game Over</Modal.Title>
        </Modal.Header>
        <Modal.Body>{winner} wins!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleReturnHome}>
            Return Home
          </Button>
          <Button variant="primary" onClick={handleRestart}>
            Restart Game
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default SinglePlayer;
