const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const api = require('./api');

module.exports = (cb) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));

    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    let players = [];
    let roomCreated = false;

    io.on('connection', (socket) => {
        let currentPlayer = null;

        console.log('Client connected:', socket.id);


        socket.on('createLobby', () => {
            roomCreated = true;
            players = []; 
            console.log('[SERVER] Lobby created by', socket.id);
        });

        socket.on('destroyLobby', () => {
            roomCreated = false;
            players = [];
            io.emit('lobbyState', players);
            io.emit('lobbyClosed'); 
            console.log('[SERVER] Lobby destroyed by', socket.id);
        });

        socket.on('playerConnected', (player) => {
            if (!roomCreated) return;
            currentPlayer = player;
            const alreadyExists = players.some(p => p.userId === player.userId);
            if (!alreadyExists) {
                players.push(player);
                socket.broadcast.emit('playerConnected', player);
                console.log(`[SERVER] Player connected: ${player.username}`);
            }
        });

        socket.on('playerDisconnected', () => {
            if (currentPlayer) {
                players = players.filter(p => p.userId !== currentPlayer.userId);
                io.emit('playerDisconnected', currentPlayer);
                console.log(`[SERVER] Player disconnected: ${currentPlayer.username}`);
            }
        });

        socket.on('requestLobbyState', () => {
            if (roomCreated) {
                socket.emit('lobbyState', players);
            } else {
                console.log('[SERVER] Lobby not created yet');
            }
        });

        socket.on('ergoStartGame', () => {
            io.emit('gameStarted');
            console.log('[SERVER] The game has started !')
        })
    });


    server.listen(process.env.PORT || 9428, () => {
        if (cb) cb(server);
        console.log('Server listening on port', process.env.PORT || 9428);
    });
};
