const { Server, Socket } = require('socket.io');

const { UserTable } = require('../../../shared/tables/user.table');

const { Game, GameID } = require("../../../shared/types");
const { GameState } = require("../../../shared/types/enums/game-state.enum");

const { GAMES, gameLocks, CONNECTED_USERS_ID, userLocks, GUEST_ROOM, ERGO_ROOM, CHILD_ROOM } = require("../app-client.helpers");

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require("./app-client.role");



/**
 * Concrete state for Ergos
 */
class ErgoRole_Impl extends AppClientRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     */
    constructor(io, socket, changeRole) {
        super(io, socket, changeRole);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Implementation :

    /**
     * @override
     */
    setUpListeners() {
        this._cleanListeners();

        this._registerListener('requestAllGames', () => {
            this.socket.emit('allGames', [...Object.values(GAMES)]);
        });

        this._registerListener('requestConnectedUsersId', () => {
            const connectedUsersId = CONNECTED_USERS_ID;
            this.socket.emit('connectedUsersId', connectedUsersId);
        });

        this._registerListener('requestDisconnectedUsersId', () => {
            const disconnectedUsersId = UserTable.getAll()
                    .map(user => user.userId)
                    .filter(userId => !CONNECTED_USERS_ID.includes(userId));
            this.socket.emit('disconnectedUsersId', disconnectedUsersId);
        });

        this._registerListener('openGame', () => {
            /** @type {Game} */
            const newGame = {
                gameId: `g${Date.now()}`,
                name: "",
                playersId: [],
                state: GameState.WAITING,
                gameConfig: {
                    maxDuration: "inf",

                    minNbPlayers: 1,
                    maxNbPlayers: 3,

                    monstersSpeedCoeff: 1,
                    monstersSpawnRate: 1,
                    encrypted: false,
                },
                playersConfig: {},
                masterId: this.socket.id,
            };
            GAMES[newGame.gameId] = newGame;

            this.io.to(ERGO_ROOM).to(CHILD_ROOM).emit('gameOpened', newGame);
            this.socket.emit('openGame_SUCCESS', newGame.gameId);

            this.spyGame(newGame.gameId);
        });

        this._registerListener('trySpyGame', (gameId) => {
            // Acquire lock for this gameId
            if (gameLocks.get(gameId)) {
                this.socket.emit('trySpyGame_FAILURE');
                return;
            }
            gameLocks.set(gameId, true);

            try {
                const game = GAMES[gameId];
                const canSpyGame = (
                    game                // Ergo can't spy a game that doesn't exist
                    && game.masterId    // Ergo can't spy a game that already has a game master
                );
                if (!canSpyGame) {
                    this.socket.emit('trySpyGame_FAILURE');
                    return;
                }

                // Record this socket as GAME_MASTER
                game.masterId = this.socket.id;
                this.spyGame(gameId);
                this.socket.emit('trySpyGame_SUCCESS');
            } finally {
                // Release lock
                gameLocks.delete(gameId);
            }
        });

         this._registerListener('tryForceDisconnection', (userId) => {
            if (userLocks.get(userId)) {
                this.socket.emit('tryForceDisconnection_FAILURE');
                return;
            }
            userLocks.set(userId, true);
            try {
                console.log(CONNECTED_USERS_ID);
                console.log(UserTable.getAll());
                const canForceDisconnection = (
                    CONNECTED_USERS_ID.includes(userId)
                    && UserTable.existsByKey({ userId })
                );
                console.log("[SERVEUR] : disconnection request received", userId);
                if (!canForceDisconnection) {
                    this.socket.emit('tryForceDisconnection_FAILURE');
                    return;
                }

                this.socket.emit('tryForceDisconnection_SUCCESS');
                console.log("[SERVEUR] : disconnection approved")
                delete CONNECTED_USERS_ID[userId];
                this.io.to(userId).emit('goBackHome');
            } finally {
                // Release lock
                userLocks.delete(userId);
            }
        });

        this._registerListener('goBackHome', () => {
            this.goBackHome();
        });
    }

    /**
     * @override
     */
    disconnect() {
        this._cleanListeners();
        this.socket.disconnect(true);
    }

    /**
     * @override
     * @returns {AppClientRole}
     */
    get role() {
        return AppClientRole.ERGO;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     * @param {GameID} gameId
     */
    spyGame(gameId) {
        console.log(`[DEBUG :: AppClient::spyGame] Client {id=${this.socket.id} ; role=${this.role}} transitionning to GAME_MASTER ...`);

        this._cleanListeners();
        this.socket.join(gameId);

        this.changeRole(new (require("./game-master.role")).GameMasterRole_Impl(
            this.io,
            this.socket,
            this.changeRole,
            gameId
        ));
    }

    /**
     * @private
     */
    goBackHome() {
        console.log(`[DEBUG :: AppClient::goBackHome] Client {id=${this.socket.id} ; role=${this.role}} transitionning to GUEST ...`);

        for (const room of this.socket.rooms) {
            if (room !== this.socket.id) {
                this.socket.leave(room);
            }
        }

        this._cleanListeners();
        this.socket.join(GUEST_ROOM);

        this.changeRole(new (require("./guest.role")).GuestRole_Impl(
            this.io,
            this.socket,
            this.changeRole
        ));
    }
}



module.exports = { ErgoRole_Impl };
