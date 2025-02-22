const express = require("express");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const hostname = "localhost";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Create an Express server
const server = express();

// CORS options
const corsOptions = {
  origin: [
    "http://192.168.15.26:3000",
    "http://localhost:3000",
    "http://192.168.1.232:212",
  ],
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
server.use(cors(corsOptions));

app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
