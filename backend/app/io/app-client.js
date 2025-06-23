const { Server, Socket } = require("socket.io");
const { UserTable } = require("../shared/tables/user.table");
// Types :
const { AnsweredQuestion, UserID, GameID } = require("../shared/types");



////////////////////////////////////////////////////////////////////////////////
// Types (JSDoc)
////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {string} SocketId
 */

/**
 * @enum {string}
 */
const GameLobbyState = {
    WAITING: "WAITING",
    RUNNING: "RUNNING",
};

/**
 * @typedef {Object} TempConfig
 * @property {boolean} addition
 * @property {boolean} soustraction
 * @property {boolean} multiplication
 * @property {boolean} division
 * @property {boolean} equation
 * @property {boolean} numberRewrite
 * @property {boolean} encryption
 */

/**
 * @typedef {Object} GameLobby
 * @property {GameID} gameId
 * @property {string} name
 * @property {UserID[]} playersId
 * @property {GameLobbyState} state
 * @property {Record<UserID, TempConfig>} playersTempConfig
 * @property {SocketId|null} [masterId]   // socket.id of the GAME_MASTER, or null if none
 */

/**
 * @enum {string}
 */
const AppClientRole = {
    GUEST: "GUEST",

    CHILD: "CHILD",
    PLAYER: "PLAYER",

    ERGO: "ERGO",
    GAME_MASTER: "GAME_MASTER",
};



////////////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////////////

// TODO : Introducing a `UsersManager` to ease the manipulation of games

/** @type {UserID[]} */
const CONNECTED_USERS_ID = [];
/** @type {Map<UserID, boolean>} */
const userLocks = new Map();


// TODO : Introducing a `GamesManager` to ease the manipulation of games

/** @type {Map<GameID, GameLobby>} */
const GAMES = new Map();
/** @type {Map<GameID, boolean>} */
const gameLocks = new Map();


const GUEST_ROOM = "GUEST_ROOM";
const CHILD_ROOM = "CHILD_ROOM";
const ERGO_ROOM = "ERGO_ROOM";



////////////////////////////////////////////////////////////////////////////////
// States :
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Abstract Class :

/**
 * The `State` class
 */
class AppClientRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     */
    constructor(io, socket, changeRole) {
        /**
         * @readonly
         */
        this.io = io;

        /**
         * @readonly
         */
        this.socket = socket;

        /**
         * @private
         * @type {{event: string, handler: Function}[]}
         */
        this._registeredListeners = [];

        /**
         * @private
         * @type {AppClientRole}
         */
        this._role;

        /**
         * @protected
         * @type {(AppClientRole_Impl) => void}
         */
        this.changeRole = changeRole;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Utils :

    /**
     * Util to register and track a listener
     * @protected
     * @param {string} event
     * @param {Function} handler
     */
    _registerListener(event, handler) {
        this.socket.on(event, handler);
        this._registeredListeners.push({ event, handler });
    }

    /**
     * Remove all the listeners that have been registered via `_registerListener()`
     * @protected
     */
    _cleanListeners() {
        for (const { event, handler } of this._registeredListeners) {
            this.socket.off(event, handler);
        }
        this._registeredListeners = [];
    }


    ////////////////////////////////////////////////////////////////////////////
    // Interface :

    /**
     * @abstract
     */
    setUpListeners() {
        throw new Error("Not implemented");
    }

    /**
     * @abstract
     */
    disconnect() {
        throw new Error("Not implemented");
    }

    /**
     * @abstract
     * @returns {AppClientRole}
     */
    get role() {
        throw new Error("Not implemented");
    }
}


////////////////////////////////////////////////////////////////////////////////
// Implementations :

class GuestRole_Impl extends AppClientRole_Impl {
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

        this._registerListener('tryConnectAsErgo', () => {
            // TODO : Adding verif with password
            const canConnectAsErgo = true;
            if (!canConnectAsErgo) {
                this.socket.emit("tryConnectAsErgo_FAILURE");
                return;
            }
            this.connectAsErgo();
            this.socket.emit("tryConnectAsErgo_SUCCESS");
        });

        this._registerListener('requestAvailableUsersId', () => {
            // DEBUG ::
            console.log("Received : 'requestAvailableUsersId'");
            console.log("Sending :");
            console.log(UserTable.getAll()
                .map(user => user.userId)
                .filter(userId => !CONNECTED_USERS_ID.includes(userId))
            );

            this.socket.emit('availableUsersId', UserTable.getAll()
                .map(user => user.userId)
                .filter(userId => !CONNECTED_USERS_ID.includes(userId))
            );
        });

        this._registerListener('tryConnectAsChild', (userId) => {
            // Acquire lock for this userId
            if (userLocks.get(userId)) {
                this.socket.emit('tryConnectAsChild_FAILURE');
                return;
            }
            userLocks.set(userId, true);

            try {
                const canConnectAsChild = (
                    !CONNECTED_USERS_ID.includes(userId)  // Guest can only connect as child that aren't yet connected
                    && UserTable.existsByKey({ userId })  // Guest can only connect as child (aka user) that exists in the db
                );
                if (!canConnectAsChild) {
                    this.socket.emit('tryConnectAsChild_FAILURE');
                    return;
                }

                this.connectAsChild(userId);
                this.socket.emit('tryConnectAsChild_SUCCESS');

                CONNECTED_USERS_ID.push(userId);
                this.io.to(GUEST_ROOM).emit('userConnected', userId);
            } finally {
                // Release lock
                userLocks.delete(userId);
            }
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
        return AppClientRole.GUEST;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     * @param {UserID} userId
     */
    connectAsChild(userId) {
        console.log(`[DEBUG :: AppClient::connectAsChild] Client {id=${this.socket.id} ; role=${this.role}} transitionning to CHILD ...`);

        this.socket.leave(GUEST_ROOM);
        this.socket.join(CHILD_ROOM);
        this.socket.join(userId);

        this.changeRole(new ChildRole_Impl(this.io, this.socket, this.changeRole, userId))
    }

    /**
     * @private
     */
    connectAsErgo() {
        console.log(`[DEBUG :: AppClient::connectAsErgo] Client {id=${this.socket.id} ; role=${this.role}} transitionning to ERGO ...`);

        this.socket.leave(GUEST_ROOM);
        this.socket.join(ERGO_ROOM);

        this.changeRole(new ErgoRole_Impl(this.io, this.socket, this.changeRole))
    }
}

class ChildRole_Impl extends AppClientRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     * @param {UserID} userId
     * @param {GameID} gameId
     */
    constructor(io, socket, changeRole, userId) {
        super(io, socket, changeRole, userId);

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
            this.socket.emit('allGames', [...GAMES.values()]);
        });

        this._registerListener('tryJoinGame', (gameId) => {
            // Acquire lock for this gameId
            if (gameLocks.get(gameId)) {
                this.socket.emit('tryJoinGame_FAILURE');
                return;
            }
            gameLocks.set(gameId, true);

            try {
                const game = GAMES.get(gameId);
                const canJoinGame = (
                    !!game                                    // Child can only join existing game
                    && game.state !== GameLobbyState.RUNNING  // Child can only join waiting game
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
                game.playersTempConfig[this._userId] = {
                    addition: user.addition,
                    soustraction: user.soustraction,
                    multiplication: user.multiplication,
                    division: user.division,
                    equation: user.equation,
                    numberRewrite: user.numberRewrite,
                    encryption: user.encryption,
                };
                this.io.to(gameId).emit('gameUpdated', game);
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

            this.io.to(GUEST_ROOM).emit('userDisconnected', oldUserId);
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

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     * @param {GameID} gameId
     */
    joinGame(gameId) {
        console.log(`[DEBUG :: AppClient::joinGame] Client {id=${this.socket.id} ; role=${this.role}} transitionning to PLAYER ...`);

        this.socket.join(gameId);

        this.changeRole(new PlayerRole_Impl(this.io, this.socket, this.changeRole, this._userId, gameId));
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
        this.socket.join(GUEST_ROOM);

        this.changeRole(new GuestRole_Impl(this.io, this.socket, this.changeRole));
    }
}

class PlayerRole_Impl extends ChildRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     * @param {UserID} userId
     * @param {GameID} gameId
     */
    constructor(io, socket, changeRole, userId, gameId) {
        super(io, socket, changeRole, userId);

        /**
         * @protected
         * @type {GameID}
         */
        this._gameId = gameId;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Implementation :

    /**
     * @override
     */
    setUpListeners() {
        super.setUpListeners(); // Set up child listeners

        this._registerListener('leaveGame', () => {
            const leftGameId = this._gameId;
            this.leaveGame();

            const gameToLeave = GAMES.get(leftGameId);
            if (!gameToLeave) {
                return;
            }

            let playerToRemoveIdx = gameToLeave.playersId.indexOf(this._userId);
            if (playerToRemoveIdx === -1) {
                // TODO : Preventing users to do dumb shit OR finding a way recover from it.
                throw new Error("Should never happen if the user act normally");
            }
            gameToLeave.playersId.splice(playerToRemoveIdx, 1);
            delete gameToLeave.playersTempConfig[this._userId];

            this.io.to(leftGameId).to(this.socket.id).emit('gameUpdated', gameToLeave);
        });

        this._registerListener('sendAnswer', (answer) => {
            // TODO : Transferring answers the game runtime
        });
    }

    /**
     * @override
     */
    disconnect() {
        // Remove from lobby
        const game = GAMES.get(this._gameId);
        if (!game) {
            console.warn(`[WARN :: AppClient::_handleDisconnectAsPlayer] No game found for gameId ${this._gameId}`);
            return;
        }

        let idx = game.playersId.indexOf(this._userId);
        if (idx !== -1) {
            game.playersId.splice(idx, 1);
        }
        delete game.playersTempConfig[this._userId];

        this.io.to(this._gameId).emit('gameUpdated', game);

        // Remove from connected users
        const userId = this._userId;

        idx = CONNECTED_USERS_ID.indexOf(userId);
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
        return AppClientRole.PLAYER;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     */
    leaveGame() {
        console.log(`[DEBUG :: AppClient::leaveGame] Client {id=${this.socket.id} ; role=${this.role}} transitionning to CHILD ...`);

        this.socket.leave(this._gameId);

        this.changeRole(new ChildRole_Impl(this.io, this.socket, this.changeRole, this.userId));
    }
}

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
            this.socket.emit('allGames', [...GAMES.values()]);
        });

        this._registerListener('openGame', () => {
            /** @type {GameLobby} */
            const newGame = {
                gameId: `g${Date.now()}`,
                name: "",
                playersId: [],
                state: GameLobbyState.WAITING,
                playersTempConfig: {},
                masterId: this.socket.id,
            };
            GAMES.set(newGame.gameId, newGame);

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
                const game = GAMES.get(gameId);
                const canSpyGame = (
                    !game                      // Ergo can't spy a game that doesn't exist
                    || game.masterId !== null  // Ergo can't spy a game that already has a game master
                );
                if (canSpyGame) {
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

        this.socket.join(gameId);

        this.changeRole(new GameMasterRole_Impl(this.io, this.socket, this.changeRole, gameId))
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
        this.socket.join(GUEST_ROOM);

        this.changeRole(new GuestRole_Impl(this.io, this.socket, this.changeRole));
    }
}

class GameMasterRole_Impl extends ErgoRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(AppClientRole_Impl) => void} changeRole
     * @param {GameID} gameId
     */
    constructor(io, socket, changeRole, gameId) {
        super(io, socket, changeRole);

        /**
         * @protected
         * @type {GameID}
         */
        this._gameId = gameId;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Implementation :

    /**
     * @override
     */
    setUpListeners() {
        super.setUpListeners(); // Set up child listeners

        this._registerListener('startGame', () => {
            const game = GAMES.get(this._gameId);
            game.state = GameLobbyState.RUNNING;
            this.io.to(ERGO_ROOM).to(CHILD_ROOM).except(this._gameId).emit('gameStarted', game.gameId);

            this.io.to(this._gameId).emit('startCountdown');
            setTimeout(() => {
                this.io.to(this._gameId).emit('endCountdown');
            }, 5000);
        });

        this._registerListener('updateGame', (update) => {
            // TODO : Enabling game master to update game
        });

        this._registerListener('closeGame', () => {
            const oldGameId = this._gameId;
            this.unspyGame();
            GAMES.delete(oldGameId);
            this.io.to(oldGameId).emit('leaveGame');
            this.io.to(ERGO_ROOM).to(CHILD_ROOM).emit('gameClosed', oldGameId);
        });
    }

    /**
     * @override
     */
    disconnect() {
        const game = GAMES.get(this._gameId);
        if (game) {
            // 1) Notify players to leave the game
            this.io.to(this._gameId).emit('leaveGame');
            // 2) Remove the game from our map
            GAMES.delete(this._gameId);
            // 3) Broadcast to all ergos/children that the game is closed
            this.io.to(ERGO_ROOM).to(CHILD_ROOM).emit('gameClosed', this._gameId);
        }

        this._cleanListeners();

        this.socket.disconnect(true);
    }

    /**
     * @override
     * @returns {AppClientRole}
     */
    get role() {
        return AppClientRole.GAME_MASTER;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     */
    unspyGame() {
        console.log(`[DEBUG :: AppClient::unspyGame] Client {id=${this.socket.id} ; role=${this.role}} transitionning to ERGO ...`);

        this.socket.leave(this._gameId);

        this.changeRole(new ErgoRole_Impl(this.io, this.socket, this.changeRole));
    }
}



////////////////////////////////////////////////////////////////////////////////
// Context :
////////////////////////////////////////////////////////////////////////////////

class AppClient {
    /**
     * @param {Server} io
     * @param {Socket} socket
     */
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;

        /**
         * @private
         * @type {AppClientRole_Impl}
         */
        this._roleImpl = new GuestRole_Impl(io, socket, (newRoleImpl) => {
            this._roleImpl = newRoleImpl;
            this._roleImpl.setUpListeners();
        });
        this._roleImpl.setUpListeners();
        this.socket.join(GUEST_ROOM)

        console.log(`[DEBUG :: AppClient::constructor] Client {id=${this.socket.id} ; role=${this.role}} instantiated`);
    }

    /**
     * @returns {AppClientRole}
     */
    get role() {
        return this._roleImpl.role;
    }


    /**
     * Handle socket disconnection
     */
    disconnect() {
        console.log(`[DEBUG :: AppClient::disconnect] Client {id=${this.socket.id} ; role=${this.role}} disconnecting ...`);

        this._roleImpl.disconnect();
    }
}

module.exports = { AppClient };
