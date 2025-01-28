"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import  express from 'express';
var express = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
//import  cors from 'cors';
var cors = require("cors");
var websocketHandler_1 = require("./websocketHandler");
var app = express();
var server = (0, http_1.createServer)(app);
// should move all the constant into env file and import from env do later
var io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow React frontend
        methods: ['GET', 'POST'],
    },
});
app.use(cors());
app.use(express.json());
var PORT = 4000;
// Initialize WebSocket handler
(0, websocketHandler_1.setupWebSocket)(io);
server.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT));
});
