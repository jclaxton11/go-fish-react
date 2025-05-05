import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import Card from "./CardComponent";
import {
  askForCardMultiplayer,
  drawCard,
  checkForBooks,
  initMultiplayerGame
} from "../GameEngine";
import { useNavigate } from "react-router-dom";

const MultiPlayer = ({ socket, playerId, players, gameId }) => {
  console.log("players", players);
  console.log("gameId", gameId);
  console.log("playerId", playerId);

  const [game, setGame] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0); // index of current player's turn
  const navigate = useNavigate();

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
    if (players.length > 0) {
      const initialGame = initMultiplayerGame(players.length);
      const sortedHands = initialGame.players.map(sortHand);

      setGame({
        ...initialGame,
        players: sortedHands,
        playerBooks: new Array(players.length).fill([]),
        deck: initialGame.deck
      });
    }
  }, [players]);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "NEXT_TURN") {
        setCurrentPlayer(data.nextPlayer);
      }
    };
  }, [socket]);

  if (!game) return <div>Loading game...</div>;

  const playerIndex = players.findIndex((id) => id === playerId);
  const isMyTurn = currentPlayer === playerIndex;

  const handleAsk = (value) => {
    if (!isMyTurn) return;

    const currentHand = game.players[currentPlayer];
    const nextPlayer = (currentPlayer + 1) % game.players.length;

    const { success, fromHand, toHand } = askForCardMultiplayer(
      currentHand,
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

    const { books, remainingHand } = checkForBooks(updatedCurrentHand);
    const updatedPlayers = [...game.players];
    updatedPlayers[currentPlayer] = sortHand(remainingHand);
    updatedPlayers[nextPlayer] = sortHand(updatedNextHand);

    const updatedPlayerBooks = [...game.playerBooks];
    updatedPlayerBooks[currentPlayer] = [
      ...(updatedPlayerBooks[currentPlayer] || []),
      ...books
    ];

    const updatedGame = {
      ...game,
      players: updatedPlayers,
      deck: newDeck,
      playerBooks: updatedPlayerBooks
    };

    setGame(updatedGame);
    const nextTurn = (currentPlayer + 1) % game.players.length;
    socket.send(
      JSON.stringify({
        type: "NEXT_TURN",
        gameId,
        nextPlayer: nextTurn
      })
    );

    if (updatedPlayers.some((hand) => hand.length === 0)) {
      endGame(updatedGame);
    }
  };

  const endGame = (finalGame) => {
    const scores = finalGame.playerBooks.map((books) => books.length || 0);
    const maxScore = Math.max(...scores);
    const winnerIndex = scores.findIndex((score) => score === maxScore);
    setWinner(`Player ${winnerIndex + 1}`);
    setShowModal(true);
  };

  const handleRestart = () => {
    const restartedGame = initMultiplayerGame(players.length);
    const sortedHands = restartedGame.players.map(sortHand);

    setGame({
      ...restartedGame,
      players: sortedHands,
      playerBooks: new Array(players.length).fill([]),
      deck: restartedGame.deck
    });
    setCurrentPlayer(0);
    setShowModal(false);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-between"
      style={{ minHeight: "70vh" }}
    >
      <div className="mt-3">
        <strong>Game ID:</strong> {gameId}
      </div>
      <div className="mt-3">
        <strong>Player {playerIndex + 1}</strong>{" "}
        {isMyTurn ? "(Your turn)" : "(Waiting)"}
      </div>

      <div className="mt-3">
        <strong>Your Books:</strong>{" "}
        {game.playerBooks[playerIndex]?.join(", ") || "None"}
      </div>

      <div
        className="d-flex justify-content-center mb-4"
        style={{ minHeight: "6rem" }}
      >
        {game.players[playerIndex].map((_, idx) => (
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
        {isMyTurn &&
          game.players[playerIndex].map((card, idx) => (
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
