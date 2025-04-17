const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const redisClient = require('./db/redisClient');
const pool = require('./db/pgClient');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket Connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'JOIN_GAME':
        console.log(`${data.playerId} joined ${data.gameId}`);
        // Add to Redis, broadcast to other players, etc.
        break;

      case 'REQUEST_CARD':
        // Handle card request logic
        break;

      // Add more case handlers as needed

      default:
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Unknown message type' }));
    }
  });

  ws.send(JSON.stringify({ type: 'CONNECTED' }));
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});
