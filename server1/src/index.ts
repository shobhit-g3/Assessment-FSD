//import  express from 'express';
import express = require('express');

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
//import  cors from 'cors';
import cors = require('cors');
import { setupWebSocket } from './websocketHandler';

const app = express();
const server = createServer(app);

// should move all the constant into env file and import from env do later
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow React frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = 4000;

// Initialize WebSocket handler
setupWebSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
