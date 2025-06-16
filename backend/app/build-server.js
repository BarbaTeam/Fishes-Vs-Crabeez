const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const api = require('./api');

const { AppClient } = require('./sockets/app-client');



module.exports = (cb) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());

    const server = http.createServer(app);

    server.listen(process.env.PORT || 9428, '0.0.0.0', () => {
        if (cb) cb(server);
        console.log(`[SERVER] Listening on port ${process.env.PORT || 9428}`);
    });

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const connectedClients = new Map();

    io.on('connection', (socket) => {
        console.log(`[DEBUG :: Server] New socket connection: ${socket.id}`);
        
        // Récupérer le token depuis l'auth (envoyé lors de la connexion)
        const existingToken = socket.handshake.auth?.token;
        
        const appClient = new AppClient(io, socket, existingToken);
        
        connectedClients.set(socket.id, appClient);
        
        socket.on('disconnect', (reason) => {
            console.log(`[DEBUG :: Server] Socket ${socket.id} disconnected: ${reason}`);
            
            const client = connectedClients.get(socket.id);
            if (client) {
                client.disconnect();
                connectedClients.delete(socket.id);
            }
        });
        
        socket.on('error', (error) => {
            console.error(`[DEBUG :: Server] Socket ${socket.id} error:`, error);
        });
    });

    setInterval(() => {
        console.log(`[DEBUG :: Server] Active connections: ${connectedClients.size}`);
    }, 30000);
};
