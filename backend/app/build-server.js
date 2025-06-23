const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const api = require('./api');
const number = require('joi/lib/types/number');
const { UserSchema } = require('./shared/schemas/user.schema')

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

    let lobbies = new Map();
    let lobbyCount = 0;

    io.on('connection', (socket) => {
        let currentPlayer = null;
        let currentLobbyId = null;

        console.log('Client connected:', socket.id);


        socket.on('createLobby', () => {
            currentLobbyId = lobbyCount++;
            lobbies.set(currentLobbyId, []);
            io.emit('lobbyCreated', currentLobbyId); 
            console.log('[SERVER] Lobby created by', socket.id);
        });

        socket.on('closeLobby', (lobbyId) => {
            lobbies.delete(lobbyId);
            io.emit('lobbyClosed', lobbyId); 
            console.log('[SERVER] Lobby destroyed by', socket.id);
        });

        socket.on('playerConnected', ({lobbyId, player}) => {
            currentPlayer = player;
            currentLobbyId = lobbyId;
            const alreadyExists = lobbies.get(lobbyId).some(p => p.userId === player.userId);
            if (!alreadyExists) {
                lobbies.get(lobbyId).push(player);
                socket.broadcast.emit('playerConnected', {lobbyId, player});
                console.log(`[SERVER] Player connected: ${player.username} to lobby ${lobbyId}`);
            }
        });

        socket.on('playerDisconnected', () => {
            if (currentPlayer && currentLobbyId) {
                const newList = lobbies.get(currentLobbyId).filter(p => p.userId !== currentPlayer.userId);
                lobbies.set(currentLobbyId,newList);
                io.emit('playerDisconnected', {lobbyId, currentPlayer});
                console.log(`[SERVER] Player disconnected: ${currentPlayer.username}`);
            }
        });

        socket.on('requestLobbies', () => {
            if(lobbies){
                socket.emit('lobbies', lobbies);
            } else {
                console.log('[SERVER] No lobby found')
            }
        })

        socket.on('requestLobbyState', (lobbyId) => {
            if (lobbyId) {
                socket.emit('lobbyState', lobbies.get(lobbyId));
            } else {
                console.log(`[SERVER] Lobby ${lobbyId} not found`);
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
