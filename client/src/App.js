import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Deck } from './components/Deck'

function App() {
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

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

  return (
    <Container className="App p-3">
      <h2 className="mb-4 text-center">Go Fish - 52 Card Deck</h2>
      <Deck />
    </Container>
  );
}

export default App;
