"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
var WebSocket = require("ws");
// coinbase api path should be store in env file but as of now i am hardcoded
var coinbaseSocket = new WebSocket('wss://ws-feed.exchange.coinbase.com');
var setupWebSocket = function (io) {
    var userSubscriptions = {};
    // Emit system status updates to all connected clients
    var emitSystemStatus = function () {
        var channels = {};
        // Aggregate subscriptions from all connected users
        Object.values(userSubscriptions).forEach(function (subscriptions) {
            subscriptions.forEach(function (product) {
                if (!channels[product]) {
                    channels[product] = new Set();
                }
                channels[product].add('level2');
                channels[product].add('matches');
            });
        });
        // Format data for the frontend
        var formattedChannels = Object.keys(channels).map(function (product) { return ({
            product: product,
            channels: Array.from(channels[product]), // Convert Set to Array
        }); });
        io.emit('systemStatus', {
            channels: formattedChannels,
        });
    };
    // Handle messages from Coinbase WebSocket API
    coinbaseSocket.on('open', function () {
        console.log('Connected to Coinbase WebSocket API');
    });
    coinbaseSocket.on('message', function (data) {
        var parsedData = JSON.parse(data.toString());
        // Debugging line start
        if (parsedData.type === 'subscriptions') {
            console.log('Subscription confirmation received:', parsedData); // Debugging line
        }
        // Debugging line end
        // Handle level2 updates
        if (parsedData.type === 'l2update') {
            console.log('l2update event detected:');
            var product_id_1 = parsedData.product_id;
            console.log('Processing l2update for product:', product_id_1);
            // Broadcast level2 updates only to clients subscribed to the product
            Object.entries(userSubscriptions).forEach(function (_a) {
                var socketId = _a[0], subscriptions = _a[1];
                if (subscriptions.includes(product_id_1)) {
                    io.to(socketId).emit('level2', parsedData); // Emit 'level2' event
                }
            });
        }
        // Handle match updates
        if (parsedData.type === 'match') {
            var product_id_2 = parsedData.product_id;
            // Broadcast match updates only to clients subscribed to the product
            Object.entries(userSubscriptions).forEach(function (_a) {
                var socketId = _a[0], subscriptions = _a[1];
                if (subscriptions.includes(product_id_2)) {
                    io.to(socketId).emit('match', parsedData); // Emit 'match' event
                }
            });
        }
    });
    coinbaseSocket.on('error', function (err) {
        console.error('Coinbase WebSocket Error:', err);
    });
    coinbaseSocket.on('close', function () {
        console.log('Coinbase WebSocket closed');
    });
    // Handle client connections
    io.on('connection', function (socket) {
        console.log('Client connected:', socket.id);
        // Initialize subscriptions for the connected client
        userSubscriptions[socket.id] = [];
        // Emit initial system status
        emitSystemStatus();
        socket.on('subscribe', function (product) {
            if (!userSubscriptions[socket.id].includes(product)) {
                userSubscriptions[socket.id].push(product);
                var message = {
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
                product: product,
                status: 'subscribed',
            });
        });
        socket.on('unsubscribe', function (product) {
            userSubscriptions[socket.id] = userSubscriptions[socket.id].filter(function (p) { return p !== product; });
            var message = {
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
                product: product,
                status: 'unsubscribed',
            });
        });
        socket.on('disconnect', function () {
            console.log('Client disconnected:', socket.id);
            var products = userSubscriptions[socket.id] || [];
            products.forEach(function (product) {
                var message = {
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
exports.setupWebSocket = setupWebSocket;
