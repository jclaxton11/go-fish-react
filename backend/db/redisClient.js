const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "redis", // This is the service name defined in docker-compose.yml
    port: 6379
  }
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.connect();

module.exports = client;
