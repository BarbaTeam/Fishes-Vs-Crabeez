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

    const games = new Map(); // gameId => { creatorSocketId, players, state }
    const selectedUsersId = new Map(); // socket.id => userId

    io.on('connection', (socket) => {
        let currentPlayer = null;
        let currentGame = null;

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
            socket.emit('selectedUsersUpdate', Array.from(selectedUsersId.values()));
        });

        socket.on('createGame', () => {
            const gameId = `game-${Date.now()}`;
            currentGame = gameId;

            const newGame = {
                creatorSocketId: socket.id,
                players: [],
                state: 'waiting'
            };

            games.set(gameId, newGame);
            socket.join(gameId);

            io.emit('gameCreated', {
                gameId,
                players: newGame.players,
                state: newGame.state
            });

            broadcastGamesUpdate();
        });

        socket.on('joinGame', ({ gameId, player }) => {
            currentPlayer = player;
            currentGame = gameId;

            if (!games.has(gameId)) return;

            const game = games.get(gameId);
            if (game.state === 'playing') {
                socket.emit('joinDenied', { reason: 'Game already started' });
                return;
            }

            socket.join(gameId);

            if (!game.players.some(p => p.userId === player.userId)) {
                game.players.push(player);
            }

            io.to(gameId).emit('playerConnected', player);
            broadcastGamesUpdate();
        });

        socket.on('leaveGame', ({ gameId, player }) => {
            if (!games.has(gameId)) return;

            const game = games.get(gameId);
            game.players = game.players.filter(p => p.userId !== player.userId);

            socket.leave(gameId);
            io.to(gameId).emit('playerDisconnected', player);
            broadcastGamesUpdate();
        });

        socket.on('closeGame', (gameId) => {
            io.to(gameId).emit('leaveGame');
            io.emit('gameClosed', gameId);
            games.delete(gameId);
            broadcastGamesUpdate();
        });

        socket.on('requestGames', () => {
            const detailedGames = Array.from(games.entries()).map(([gameId, game]) => ({
                gameId,
                players: game.players,
                state: game.state
            }));

            socket.emit('games', detailedGames.map(l => l.gameId));
            socket.emit('gamesUpdated', detailedGames);
        });

        socket.on('requestGameState', (gameId) => {
            const game = games.get(gameId);
            socket.emit('gameState', {
                players: game?.players || [],
                state: game?.state || 'waiting'
            });
        });

        socket.on('ergoStartGame', () => {
            if (currentGame && games.has(currentGame)) {
                const game = games.get(currentGame);
                game.state = 'playing';
                io.to(currentGame).emit('gameStarted');
                broadcastGamesUpdate();
            }
        });

        // Facultatif : transition "starting" -> "playing" avec délai
        socket.on('prepareStartGame', () => {
            if (currentGame && games.has(currentGame)) {
                const game = games.get(currentGame);
                game.state = 'starting';
                broadcastGamesUpdate();

                setTimeout(() => {
                    if (games.has(currentGame)) {
                        game.state = 'playing';
                        io.to(currentGame).emit('gameStarted');
                        broadcastGamesUpdate();
                    }
                }, 3000);
            }
        });

        // Game logic
        const { QuestionsGenerator } = require('./game/question-generator');
        const { UserTable } = require('./shared/tables/user.table');

        socket.on('requestQuestion', (userId) => {
            const user = UserTable.getByKey({ userId });
            const mask = [
                user.userConfig.addition,
                user.userConfig.soustraction,
                user.userConfig.multiplication,
                user.userConfig.division,
                user.userConfig.numberRewrite,
                user.userConfig.encryption,
                user.userConfig.equation
            ];
            socket.emit('questionCreated', QuestionsGenerator.genQuestion(mask));
        });

        socket.on('disconnect', () => {
            for (const [gameId, game] of games.entries()) {
                if (game.creatorSocketId === socket.id) {
                    games.delete(gameId);
                    io.emit('gameClosed', gameId);
                }
            }

            if (currentPlayer && currentGame && games.has(currentGame)) {
                const game = games.get(currentGame);
                game.players = game.players.filter(p => p.userId !== currentPlayer.userId);
                io.to(currentGame).emit('playerDisconnected', { gameId: currentGame, player: currentPlayer });
            }

            selectedUsersId.delete(socket.id);

            broadcastSelectedUsers();
            broadcastGamesUpdate();
        });

        function broadcastSelectedUsers() {
            const selectedUserList = Array.from(selectedUsersId.values());
            io.emit('selectedUsersUpdate', selectedUserList);
        }

        function broadcastGamesUpdate() {
            const gameList = Array.from(games.entries()).map(([gameId, game]) => ({
                gameId,
                players: game.players,
                state: game.state
            }));
            io.emit('gamesUpdated', gameList);
        }
    });

    server.listen(process.env.PORT || 9428, () => {
        if (cb) cb(server);
        console.log(`[SERVER] Listening on port ${process.env.PORT || 9428}`);
    });
};
