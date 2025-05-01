import React, { useEffect, useRef, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Deck } from './components/Deck';

function App() {
  const [messages, setMessages] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const socket = useRef(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    socket.current = new WebSocket('ws://localhost:3001');

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    return () => socket.current.close();
  }, []);

  const joinGame = () => {
    socket.current.send(JSON.stringify({
      type: 'JOIN',
      gameId: 'abc123',
      playerId: 'player1',
    }));
  };

  const handleStartGame = (mode) => {
    setMode(mode);
    if (mode === 'multiplayer') {
      joinGame();
    }
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <Container className="App p-5 text-center">
        <div>
        <h1 className="mb-4">Welcome to Go Fish!</h1>
        <Button variant="primary" className="m-2" onClick={() => handleStartGame('singleplayer')}>
          Single Player
        </Button>
        <Button variant="success" className="m-2" onClick={() => handleStartGame('multiplayer')}>
          Multiplayer
        </Button>
        </div>
        {/* <img src="/gofish.png" alt="Go Fish Logo" style={{ width: '1000px', marginBottom: '20px' }} /> */}
      </Container>
    );
  }

  return (
    <Container className="App p-3">
      <div className="row align-items-center mb-4">
        <div className="col-2 text-start">
          <button className="btn btn-outline-secondary" onClick={() => setGameStarted(false)}>
            ⬅ Back
          </button>
        </div>
        <div className="col-8 text-center">
          <h2 className="m-0">Go Fish - 52 Card Deck</h2>
        </div>
        <div className="col-2">{mode === 'multiplayer' ? 'Multiplayer' : mode === 'singleplayer' ? 'Single Player' : ''}</div>
      </div>
      <Deck inputMode={mode} />
    </Container>
  );
}

export default App;
