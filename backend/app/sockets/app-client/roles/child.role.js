const { Server, Socket } = require('socket.io');

const { UserTable } = require('../../../shared/tables/user.table');
const { UserID, GameID } = require("../../../shared/types");
const { GameState } = require("../../../shared/types/enums/game-state.enum");

const { registerRunningGame } = require('../../../game-runner');
const { GameRuntime } = require('../../../game/runtime');

const { CONNECTED_USERS_ID, GAMES, gameLocks, GUEST_ROOM, CHILD_ROOM, ERGO_ROOM } = require('../app-client.helpers');

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require('./app-client.role');

/**
 * The child must need to receive at all time :
 *  - All the already created games
 *  - A game has been created
 *  - A game has been deleted
 *  - A game has changed its state
 *  - A game has changed its name
 *  - A player has joined a game
 *  - A player has left a game
 */

/**
 * The child must need to send at all time :
 *  - Joined a game
 *  - goBackHome
 */

/**
 * Concrete state for Children
 */
class ChildRole_Impl extends AppClientRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     * @param {UserID} userId
     */
    constructor(io, socket, changeRole, userId) {
        super(io, socket, changeRole);

        /**
         * @protected
         * @type {UserID}
         */
        this._userId = userId;

        this.setUpListeners();
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

        this._registerListener('openGame', () => {
            /** @type {GameLobby} */
            const newGame = {
                gameId: `g${Date.now()}`,
                name: "",
                playersId: [],
                state: GameState.WAITING,
                gameConfig: {
                    maxDuration: "inf",

                    minNbPlayers: 1,
                    maxNbPlayers: 1,

                    monstersSpeedCoeff: 1,
                    monstersSpawnRate: 1,
                    encrypted: false,
                },
                playersConfig: {},
            };

            this.socket.emit('openGame_SUCCESS', newGame.gameId);
            
            this.joinGame(newGame.gameId);

            newGame.playersId.push(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            console.log(this._userId);
            const user = UserTable.getByKey({ userId: this._userId });

            newGame.playersConfig[this._userId] = {
                notionsMask: user.config.notionsMask,
            }

            newGame.state = GameState.RUNNING;
            
            GAMES[newGame.gameId] = newGame;

            this.io.to(ERGO_ROOM).emit('gameStarted', newGame.gameId, () =>
                registerRunningGame(newGame.gameId, new GameRuntime(this.io, newGame))
            );
        });

        this._registerListener('tryJoinGame', (gameId) => {
            // Acquire lock for this gameId
            if (gameLocks.get(gameId)) {
                this.socket.emit('tryJoinGame_FAILURE');
                return;
            }
            gameLocks.set(gameId, true);

            try {
                const game = GAMES[gameId];
                const canJoinGame = (
                    !!game                                    // Child can only join existing game
                    && game.state !== GameState.RUNNING  // Child can only join waiting game
                    && game.playersId.length < 3              // Child can only join waiting game with enough room
                );
                if (!canJoinGame) {
                    this.socket.emit('tryJoinGame_FAILURE');
                    return;
                }

                this.joinGame(gameId);
                this.socket.emit('tryJoinGame_SUCCESS');

                game.playersId.push(this._userId);
                const user = UserTable.getByKey({ userId: this._userId });
                game.playersConfig[this._userId] = {
                    notionsMask: user.config.notionsMask,
                }
                this.io.to(gameId).to(ERGO_ROOM).to(CHILD_ROOM).emit('gameUpdated', game);
            } finally {
                // Release lock
                gameLocks.delete(gameId);
            }
        });

        this._registerListener('goBackHome', () => {
            const oldUserId = this._userId;
            this.goBackHome();

            let userToRemoveIdx = CONNECTED_USERS_ID.indexOf(oldUserId);
            if (userToRemoveIdx === -1) {
                // TODO : Preventing users to do dumb shit OR finding a way recover from it.
                throw new Error("Should never happen if the user act normally");
            }
            CONNECTED_USERS_ID.splice(userToRemoveIdx, 1);

            this.io.to(GUEST_ROOM).to(ERGO_ROOM).emit('userDisconnected', oldUserId);
        });
    }

    /**
     * @override
     */
    disconnect() {
        const userId = this._userId;

        let idx = CONNECTED_USERS_ID.indexOf(userId);
        if (idx !== -1) {
            CONNECTED_USERS_ID.splice(idx, 1);
        }

        this.io.to(GUEST_ROOM).emit('userDisconnected', userId);

        this._cleanListeners();
        this.socket.disconnect(true);
    }

    /**
     * @override
     * @returns {AppClientRole}
     */
    get role() {
        return AppClientRole.CHILD;
    }

    /**
     * @override
     * @returns {string}
     */
    get userId() {
        return this._userId;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     * @param {GameID} gameId
     */
    joinGame(gameId) {
        console.log(`[DEBUG :: AppClient::joinGame] Client {id=${this.socket.id} ; role=${this.role}} transitionning to PLAYER ...`);

        this._cleanListeners();
        this.socket.join(gameId);

        this.changeRole(new (require("./player.role")).PlayerRole_Impl(
            this.io,
            this.socket,
            this.changeRole,
            this._userId,
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

        this.changeRole(new (require("./guest.role")).GuestRole_Impl(this.io, this.socket, this.changeRole));
    }
}



module.exports = { ChildRole_Impl };
