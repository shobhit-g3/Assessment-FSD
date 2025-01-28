Coinbase API Server - README

Overview

The Coinbase API Server is a backend application that facilitates real-time communication between clients and the Coinbase WebSocket API. It allows clients to subscribe to cryptocurrency products, receive updates for level2 order book changes, match events, and monitor the system's subscription status.


Technologies Used

Node.js: Backend runtime.

TypeScript: For type-safe development.

WebSocket: For real-time communication with Coinbase.

Socket.IO: For managing real-time communication with clients.

Express: To set up the server framework.

CORS: To enable cross-origin requests.


Installation

Prerequisites

Node.js (version 18 or later)

npm version 9.6.7

cd <repository_folder>

npm install

tsc ./src/index.ts

npm start

The server will start at http://localhost:4000


Key Files

index.ts

Sets up the Express server and integrates Socket.IO.

Initializes WebSocket handlers for client communication.

websocketHandler.ts

Manages real-time communication with the Coinbase WebSocket API.

Handles subscriptions, unsubscriptions, and broadcasts updates.