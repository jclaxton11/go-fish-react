import React, { useEffect, useRef, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";

function MultiplayerGame() {
  const socket = useRef(null);
  const [players, setPlayers] = useState([]);
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
      if (data.type === "PLAYER_JOINED") {
        setPlayers((prev) => [...prev, data.playerId]);
      }
    };

    return () => socket.current.close();
  }, [gameId]);

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
          <strong>Players:</strong>
          <ul className="list-unstyled">
            {players.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}

export default MultiplayerGame;
