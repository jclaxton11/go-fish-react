import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SinglePlayer } from "./components/SinglePlayer";

function SinglePlayerGame() {
  const navigate = useNavigate();

  return (
    <Container className="App p-3">
      <div className="row align-items-center mb-4">
        <div className="col-2 text-start">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
          >
            ⬅ Back
          </button>
        </div>
        <div className="col-8 text-center">
          <h2 className="m-0">Go Fish - 52 Card Deck</h2>
        </div>
        <div className="col-2 text-end">Single Player</div>
      </div>

      <SinglePlayer inputMode="singleplayer" />
    </Container>
  );
}

export default SinglePlayerGame;
