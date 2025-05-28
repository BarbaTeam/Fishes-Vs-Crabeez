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
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));

    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const roomPlayers = new Map(); // lobbyId => { creatorSocketId, players, lastActive }
    const selectedUsersId = new Map(); // socket.id => userId ; pour ne pas pouvoir selectionner le même utilisateur plusieurs fois

    io.on('connection', (socket) => {
        let currentPlayer = null;
        let currentRoom = null;

        console.log(`[SERVER] Client connecté : ${socket.id}`);

        socket.on('selectUser', (userId) => {
            if ([...selectedUsersId.values()].includes(userId)) {
                socket.emit('userSelectionDenied', userId);
            } else {
                selectedUsersId.set(socket.id, userId);
                socket.emit('userSelectionGranted', userId);
                broadcastSelectedUsers();
            }
        });

        socket.on('deselectUser', (socketId) => {
            if (selectedUsersId.has(socketId)) {
                selectedUsersId.delete(socketId);
                broadcastSelectedUsers();
            }
        });

        socket.on('requestSelectedUsersId', () => {
                const selectedUserList = Array.from(selectedUsersId.values());
                socket.emit('selectedUsersUpdate', selectedUserList);
            }
        );

        socket.on('createLobby', () => {
            const lobbyId = `lobby-${Date.now()}`;
            roomPlayers.set(lobbyId, {
                creatorSocketId: socket.id,
                players: [],
                lastActive: Date.now()
            });

            socket.join(lobbyId);
            io.emit('lobbyCreated', lobbyId);
        });

        socket.on('joinLobby', ({ lobbyId, player }) => {
            currentPlayer = player;
            currentRoom = lobbyId;
            socket.join(lobbyId);

            if (!roomPlayers.has(lobbyId)) return;

            const lobby = roomPlayers.get(lobbyId);
            if (!lobby.players.some(p => p.userId === player.userId)) {
                lobby.players.push(player);
            }

            lobby.lastActive = Date.now();

            io.to(lobbyId).emit('playerConnected', { lobbyId, player });
            broadcastLobbiesUpdate();
        });

        socket.on('leaveLobby', ({ lobbyId, player }) => {
            if (!roomPlayers.has(lobbyId)) return;

            const lobby = roomPlayers.get(lobbyId);
            lobby.players = lobby.players.filter(p => p.userId !== player.userId);
            lobby.lastActive = Date.now();

            socket.leave(lobbyId);
            io.to(lobbyId).emit('playerDisconnected', { lobbyId, player });
            broadcastLobbiesUpdate();
        });

        socket.on('closeLobby', (lobbyId) => {
            roomPlayers.delete(lobbyId);
            io.emit('lobbyClosed', lobbyId);
            io.to(lobbyId).emit('leaveLobby', lobbyId);
            broadcastLobbiesUpdate();
        });

        socket.on('requestLobbies', () => {
            const detailedLobbies = Array.from(roomPlayers.entries()).map(([lobbyId, lobby]) => ({
                lobbyId,
                players: lobby.players
            }));

            socket.emit('lobbies', detailedLobbies.map(l => l.lobbyId));
            socket.emit('lobbiesUpdated', detailedLobbies);
        });

        socket.on('requestLobbyState', (lobbyId) => {
            const lobby = roomPlayers.get(lobbyId);
            const players = lobby?.players || [];
            socket.emit('lobbyState', { lobbyId, players });
        });

        socket.on('ergoStartGame', () => {
            if (currentRoom) {
                io.to(currentRoom).emit('gameStarted');
            }
        });

        socket.on('disconnect', () => {
            for (const [lobbyId, lobby] of roomPlayers.entries()) {
                if (lobby.creatorSocketId === socket.id) {
                    roomPlayers.delete(lobbyId);
                    io.emit('lobbyClosed', lobbyId);
                }
            }

            if (currentPlayer && currentRoom && roomPlayers.has(currentRoom)) {
                const lobby = roomPlayers.get(currentRoom);
                lobby.players = lobby.players.filter(p => p.userId !== currentPlayer.userId);
                io.to(currentRoom).emit('playerDisconnected', { lobbyId: currentRoom, player: currentPlayer });
            }

            selectedUsersId.delete(socket.id);

            broadcastSelectedUsers();
            broadcastLobbiesUpdate();
        });

        function broadcastSelectedUsers() {
            console.log("update")
            const selectedUserList = Array.from(selectedUsersId.values());
            io.emit('selectedUsersUpdate', selectedUserList);
        }

        function broadcastLobbiesUpdate() {
            const lobbyList = Array.from(roomPlayers.entries()).map(([lobbyId, lobby]) => ({
                lobbyId,
                players: lobby.players
            }));
            io.emit('lobbiesUpdated', lobbyList);
        }
    });

    server.listen(process.env.PORT || 9428, () => {
        if (cb) cb(server);
        console.log(`[SERVER] Listening on port ${process.env.PORT || 9428}`);
    });
};
