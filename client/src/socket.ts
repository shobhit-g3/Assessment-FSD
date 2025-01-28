// src/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Replace with your backend URL
const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'], // Use websocket transport
  reconnection: true,        // Auto-reconnect if the connection is lost
});

export default socket;
