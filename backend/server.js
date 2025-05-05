const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const redisClient = require("./db/redisClient");
// const pool = require("./db/pgClient");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// // Log when Redis connects
// redisClient.on("connect", () => {
//   console.log("Redis connected");
// });

// // Log any Redis errors
// redisClient.on("error", (err) => {
//   console.error("Redis error:", err);
// });

// await redisClient.connect();

// Handle WebSocket Connections
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    console.log("Received from client:", data);

    if (data.type === "JOIN_GAME") {
      await redisClient.sAdd(`game:${data.gameId}:players`, data.playerId);
      console.log(`Player ${data.playerId} added to game ${data.gameId}`);

      const players = await redisClient.sMembers(`game:${data.gameId}:players`);
      console.log("Players in game:", players);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "PLAYERS_LIST",
              gameId: data.gameId,
              players
            })
          );
        }
      });
    }

    if (data.type === "START_GAME") {
      console.log(`Starting game ${data.gameId}`);
      const { gameId } = data;

      // Broadcast GAME_STARTED to all clients in this game
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "GAME_STARTED" }));
        }
      });
    }

    if (data.type === "NEXT_TURN") {
      const { gameId, nextPlayer } = data;

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "NEXT_TURN",
              gameId,
              nextPlayer
            })
          );
        }
      });
    }
  });

  // Send initial connection message after client joins
  ws.send(JSON.stringify({ type: "CONNECTED" }));
});

server.listen(5000, () => {
  console.log("WebSocket server listening on port 5000");
});
