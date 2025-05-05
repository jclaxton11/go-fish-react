import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import MultiPlayer from "./components/MultiPlayer";

function MultiplayerGame() {
  const socket = useRef(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get("gameId");
  const playerId = useRef(uuidv4());

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      socket.current.send(
        JSON.stringify({
          type: "JOIN_GAME",
          gameId,
          playerId: playerId.current
        })
      );
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from server:", data);
      if (data.type === "PLAYERS_LIST") {
        // Replace the players state with the updated list from the server
        setPlayers(data.players); // Set the full list of players
      }

      if (data.type === "GAME_STARTED") {
        setGameStarted(true);
      }
    };

    return () => socket.current.close();
  }, [gameId]);

  const handleStartMultiplayerGame = () => {
    socket.current.send(JSON.stringify({ type: "START_GAME", gameId }));
  };

  if (gameStarted) {
    return (
      <MultiPlayer
        socket={socket.current}
        playerId={playerId.current}
        players={players}
        gameId={gameId}
      />
    );
  }

  return (
    <Container className="App p-3">
      {/* Top bar with back button */}
      <div className="d-flex justify-content-start mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          ⬅ Back
        </button>
      </div>

      {/* Centered content */}
      <div className="text-center">
        <h3>Multiplayer Mode</h3>
        <p>Game ID: {gameId}</p>
        <p>Share this ID with friends!</p>

        <div className="mt-3">
          <p>
            <strong>Players:</strong> {players.length}
          </p>
        </div>
        <div className="mt-3">
          <Button
            variant="primary"
            onClick={handleStartMultiplayerGame}
            disabled={players.length < 2} // Disable button if less than 2 players
          >
            Start Game
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default MultiplayerGame;
