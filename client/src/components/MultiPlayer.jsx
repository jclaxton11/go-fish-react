import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import Card from "./CardComponent";
import { initGame, askForCard, drawCard, checkForBooks } from "../GameEngine";

export const MultiPlayer = ({ inputMode, setGameStarted }) => {
  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null); // Track the winner
  const [showModal, setShowModal] = useState(false); // Show the popup
  const [currentPlayer, setCurrentPlayer] = useState(0); // Track whose turn it is (0 to 5 for up to 6 players)

  // Sort hand based on card value
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
    const sortedHands = initialGame.players.map((player) =>
      sortHand(player.hand)
    );

    setGame({
      ...initialGame,
      players: sortedHands
    });
  }, []);

  if (!game) return <div>Loading...</div>;

  // Handle the player's request to ask for a card
  const handleAsk = (value) => {
    const currentPlayerHand = game.players[currentPlayer];
    const nextPlayer = (currentPlayer + 1) % game.players.length; // Move to the next player

    const { success, fromHand, toHand } = askForCard(
      currentPlayerHand,
      game.players[nextPlayer],
      value
    );
    let updatedCurrentHand = fromHand;
    let updatedNextHand = toHand;
    let newDeck = game.deck;

    if (!success) {
      const drawResult = drawCard(updatedCurrentHand, newDeck);
      updatedCurrentHand = drawResult.hand;
      newDeck = drawResult.deck;
    }

    const { books: playerBooks, remainingHand } =
      checkForBooks(updatedCurrentHand);

    const updatedPlayers = [...game.players];
    updatedPlayers[currentPlayer] = sortHand(remainingHand);
    updatedPlayers[nextPlayer] = sortHand(updatedNextHand);

    let updatedGame = {
      ...game,
      players: updatedPlayers,
      playerBooks: [...game.playerBooks, ...playerBooks],
      deck: newDeck,
      currentPlayer: nextPlayer // Move to the next player
    };

    setGame(updatedGame);

    // Check for game end
    if (updatedGame.players.some((playerHand) => playerHand.length === 0)) {
      endGame(updatedGame);
      return;
    }
  };

  const endGame = (finalGameState) => {
    const playerBooksCounts = finalGameState.players.map(
      (_, idx) => finalGameState.playerBooks[idx]?.length || 0
    );
    const maxBooks = Math.max(...playerBooksCounts);
    const winnerIndex = playerBooksCounts.findIndex(
      (count) => count === maxBooks
    );
    const winner = `Player ${winnerIndex + 1}`;

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
        <strong>Player {currentPlayer + 1}'s Books: </strong>
        {game.playerBooks.join(", ") || "None"}
      </div>
      <div
        className="d-flex justify-content-center mb-4"
        style={{ minHeight: "6rem" }}
      >
        {game.players[currentPlayer].map((_, idx) => (
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
        {game.players[currentPlayer].map((card, idx) => (
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

export default MultiPlayer;
