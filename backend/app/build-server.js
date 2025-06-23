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
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms')) // Allégé

    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const roomPlayers = new Map(); // lobbyId => [players]

    io.on('connection', (socket) => {
        let currentPlayer = null;
        let currentRoom = null;

        console.log(`[SERVER] Client connecté : ${socket.id}`);

        socket.on('createLobby', () => {
            const lobbyId = `lobby-${Date.now()}`;
            roomPlayers.set(lobbyId, []);
            socket.join(lobbyId);
            io.emit('lobbyCreated', lobbyId);
        });

        socket.on('joinLobby', ({ lobbyId, player }) => {
            currentPlayer = player;
            currentRoom = lobbyId;
            socket.join(lobbyId);

            if (!roomPlayers.has(lobbyId)) roomPlayers.set(lobbyId, []);
            const players = roomPlayers.get(lobbyId);
            if (!players.some(p => p.userId === player.userId)) {
                players.push(player);
            }

            io.to(lobbyId).emit('playerConnected', { lobbyId, player });
            broadcastLobbiesUpdate();
        });

        socket.on('leaveLobby', ({ lobbyId, player }) => {
            if (!roomPlayers.has(lobbyId)) return;

            const players = roomPlayers.get(lobbyId);
            roomPlayers.set(lobbyId, players.filter(p => p.userId !== player.userId));

            socket.leave(lobbyId);
            io.to(lobbyId).emit('playerDisconnected', { lobbyId, player });
            broadcastLobbiesUpdate();
        });

        socket.on('closeLobby', (lobbyId) => {
            roomPlayers.delete(lobbyId);
            io.emit('lobbyClosed', lobbyId);
            io.to(lobbyId).emit('leaveLobby', lobbyId); // Optionnel
            broadcastLobbiesUpdate();
        });

        socket.on('requestLobbies', () => {
            const lobbyList = Array.from(roomPlayers.keys());
            const detailedLobbies = Array.from(roomPlayers.entries()).map(([lobbyId, players]) => ({
                lobbyId,
                players
            }));

            socket.emit('lobbies', lobbyList);
            socket.emit('lobbiesUpdated', detailedLobbies);
        });

        socket.on('requestLobbyState', (lobbyId) => {
            const players = roomPlayers.get(lobbyId) || [];
            socket.emit('lobbyState', { lobbyId, players });
        });

        socket.on('ergoStartGame', () => {
            if (currentRoom) {
                io.to(currentRoom).emit('gameStarted');
            }
        });

        socket.on('disconnect', () => {
            if (currentPlayer && currentRoom) {
                const players = roomPlayers.get(currentRoom) || [];
                roomPlayers.set(currentRoom, players.filter(p => p.userId !== currentPlayer.userId));
                io.to(currentRoom).emit('playerDisconnected', { lobbyId: currentRoom, player: currentPlayer });
                broadcastLobbiesUpdate();
            }
        });

        function broadcastLobbiesUpdate() {
            const lobbyList = Array.from(roomPlayers.entries()).map(([lobbyId, players]) => ({
                lobbyId,
                players
            }));
            io.emit('lobbiesUpdated', lobbyList);
        }
    });

    server.listen(process.env.PORT || 9428, () => {
        if (cb) cb(server);
        console.log(`[SERVER] Listening on port ${process.env.PORT || 9428}`);
    });
};
