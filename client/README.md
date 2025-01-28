Client Project Documentation

Overview

This project is a React-based frontend client designed to interact with a WebSocket-enabled backend. The client allows users to subscribe and unsubscribe to real-time updates from Coinbase WebSocket API for specific cryptocurrency trading pairs (e.g., BTC-USD, ETH-USD). Users can also monitor system statuses and view data updates for level2 (order book) and match (trade executions) events.


Features

Subscription Management:

Subscribe to trading pairs for real-time updates.

Unsubscribe from trading pairs as needed.

Real-Time Data:

Receive updates for level2 (order book changes).

Receive updates for match (trade executions).

System Status Display:

View active subscriptions and channels in real time.


Prerequisites

Node.js: Ensure you have Node.js (version 18 or later) installed.

Package Manager: Either npm version 9.6.7.

Backend Server: Ensure the backend WebSocket server is running and accessible.

Environment Setup:

The backend server must allow CORS for the frontend (default: http://localhost:3000).


####################################################################################

Installation

cd <client-project>

npm install

npm run build

npm start

Access the Client:
Open your browser and navigate to http://localhost:3000.






Troubleshooting

No Data Updates:

Ensure the backend WebSocket server is running.

Verify the origin and methods in the backend CORS configuration.

WebSocket Errors:

Check the browser console for WebSocket connection errors.

Verify the backend server's WebSocket URL.
