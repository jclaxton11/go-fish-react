import React, { useEffect, useRef, useState } from 'react';

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
    <div>
      <h1>Go Fish Game</h1>
      <button onClick={joinGame}>Join Game</button>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
