const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const redisClient = require("./db/redisClient");
// const pool = require("./db/pgClient");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket Connections
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    console.log("Received from client:", data);
    switch (data.type) {
      case "JOIN_GAME":
        console.log(`${data.playerId} joined ${data.gameId}`);
        // Step 1: Add player to Redis (could store a game state, or player info)
        redisClient.sadd(
          `game:${data.gameId}:players`,
          data.playerId,
          (err, res) => {
            if (err) {
              console.error("Error adding player to Redis:", err);
              return;
            }

            // // Step 2: Broadcast to other players in the game that a player has joined
            // wss.clients.forEach((client) => {
            //   if (client !== ws && client.readyState === WebSocket.OPEN) {
            //     client.send(
            //       JSON.stringify({
            //         type: "PLAYER_JOINED",
            //         playerId: data.playerId,
            //         gameId: data.gameId
            //       })
            //     );
            //   }
            // });
          }
        );
        break;

      case "REQUEST_CARD":
        // Handle card request logic
        break;

      // Add more case handlers as needed

      default:
        ws.send(
          JSON.stringify({ type: "ERROR", message: "Unknown message type" })
        );
    }
  });

  ws.send(JSON.stringify({ type: "CONNECTED" }));
});

server.listen(3005, () => {
  console.log("WebSocket server listening on port 3005");
});
