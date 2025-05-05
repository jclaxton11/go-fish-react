import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const [joinGameId, setJoinGameId] = useState("");
  const navigate = useNavigate();

  const handleStartGame = (mode) => {
    if (mode === "singleplayer") {
      navigate("/SinglePlayerGame");
    } else {
      const newGameId = Math.random().toString(36).slice(2, 6);
      navigate(`/MultiplayerGame?gameId=${newGameId}`);
    }
  };

  const handleJoinMultiplayerGame = () => {
    if (joinGameId) {
      navigate(`/MultiplayerGame?gameId=${joinGameId}`);
    } else {
      alert("Please enter a valid Game ID to join.");
    }
  };

  return (
    <Container className="App p-5 text-center position-relative">
      {/* Top-right Join Game UI */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: "10px"
        }}
      >
        <input
          type="text"
          placeholder="Enter Game ID"
          className="form-control"
          style={{ width: "150px" }}
          value={joinGameId}
          onChange={(e) => setJoinGameId(e.target.value)}
        />
        <Button variant="info" onClick={handleJoinMultiplayerGame}>
          Join Game
        </Button>
      </div>

      <h1 className="mb-4">Welcome to Go Fish!</h1>
      <Button
        variant="primary"
        className="m-2"
        onClick={() => handleStartGame("singleplayer")}
      >
        Start Single Player Game
      </Button>
      <Button
        variant="success"
        className="m-2"
        onClick={() => handleStartGame("multiplayer")}
      >
        Start Multiplayer Game
      </Button>
    </Container>
  );
}

export default Home;
