import { Server, Socket } from 'socket.io';
import WebSocket = require('ws');

interface UserSubscription {
  [socketId: string]: string[];
}
// coinbase api path should be store in env file but as of now i am hardcoded
const coinbaseSocket = new WebSocket('wss://ws-feed.exchange.coinbase.com');

export const setupWebSocket = (io: Server) => {
  const userSubscriptions: UserSubscription = {};

  // Emit system status updates to all connected clients
  const emitSystemStatus = () => {
    const channels: { [product: string]: Set<string> } = {};

    // Aggregate subscriptions from all connected users
    Object.values(userSubscriptions).forEach((subscriptions) => {
      subscriptions.forEach((product) => {
        if (!channels[product]) {
          channels[product] = new Set();
        }
        channels[product].add('level2');
        channels[product].add('matches');
      });
    });

    // Format data for the frontend
    const formattedChannels = Object.keys(channels).map((product) => ({
      product,
      channels: Array.from(channels[product]), // Convert Set to Array
    }));

    io.emit('systemStatus', {
      channels: formattedChannels,
    });
  };

  // Handle messages from Coinbase WebSocket API
  coinbaseSocket.on('open', () => {
    console.log('Connected to Coinbase WebSocket API');
  });

  coinbaseSocket.on('message', (data) => {
    const parsedData = JSON.parse(data.toString());
    // Debugging line start
    if (parsedData.type === 'subscriptions') {
    console.log('Subscription confirmation received:', parsedData); // Debugging line
  }
// Debugging line end
    // Handle level2 updates
    if (parsedData.type === 'l2update') {
       console.log('l2update event detected:');
      const { product_id } = parsedData;
 console.log('Processing l2update for product:', product_id);
      // Broadcast level2 updates only to clients subscribed to the product
      Object.entries(userSubscriptions).forEach(([socketId, subscriptions]) => {
        if (subscriptions.includes(product_id)) {
          io.to(socketId).emit('level2', parsedData); // Emit 'level2' event
         
          
        }
      });
    }

    // Handle match updates
    if (parsedData.type === 'match') {
      const { product_id } = parsedData;

      // Broadcast match updates only to clients subscribed to the product
      Object.entries(userSubscriptions).forEach(([socketId, subscriptions]) => {
        if (subscriptions.includes(product_id)) {
          io.to(socketId).emit('match', parsedData); // Emit 'match' event
        }
      });
    }
  });

  coinbaseSocket.on('error', (err) => {
    console.error('Coinbase WebSocket Error:', err);
  });

  coinbaseSocket.on('close', () => {
    console.log('Coinbase WebSocket closed');
  });

  // Handle client connections
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Initialize subscriptions for the connected client
    userSubscriptions[socket.id] = [];

    // Emit initial system status
    emitSystemStatus();

    socket.on('subscribe', (product: string) => {
      if (!userSubscriptions[socket.id].includes(product)) {
        userSubscriptions[socket.id].push(product);

        const message = {
          type: 'subscribe',
          channels: [
            { name: 'level2', product_ids: [product] },
            { name: 'matches', product_ids: [product] },
          ],
        };
        coinbaseSocket.send(JSON.stringify(message));
          console.log('Subscription message sent:', message); // Debugging line
        // Update system status
        emitSystemStatus();
      }

      socket.emit('subscriptionStatus', {
        product,
        status: 'subscribed',
      });
    });

    socket.on('unsubscribe', (product: string) => {
      userSubscriptions[socket.id] = userSubscriptions[socket.id].filter(
        (p) => p !== product
      );

      const message = {
        type: 'unsubscribe',
        channels: [
          { name: 'level2', product_ids: [product] },
          { name: 'matches', product_ids: [product] },
        ],
      };
      coinbaseSocket.send(JSON.stringify(message));

      // Update system status
      emitSystemStatus();

      socket.emit('subscriptionStatus', {
        product,
        status: 'unsubscribed',
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      const products = userSubscriptions[socket.id] || [];
      products.forEach((product) => {
        const message = {
          type: 'unsubscribe',
          channels: [
            { name: 'level2', product_ids: [product] },
            { name: 'matches', product_ids: [product] },
          ],
        };
        coinbaseSocket.send(JSON.stringify(message));
      });

      delete userSubscriptions[socket.id];

      // Update system status
      emitSystemStatus();
    });
  });

  // Periodically emit system status
  setInterval(emitSystemStatus, 5000);
};
