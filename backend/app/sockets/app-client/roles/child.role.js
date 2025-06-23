const { Server, Socket } = require('socket.io');

const { UserTable } = require('../../../shared/tables/user.table');
const { UserID, GameID } = require("../../../shared/types");
const { GameLobbyState } = require("../../../shared/types/enums/game-lobby-state.enum");

const { CONNECTED_USERS_ID, GAMES_LOBBY, gameLocks, GUEST_ROOM, CHILD_ROOM, ERGO_ROOM } = require('../app-client.helpers');

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require('./app-client.role');



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
            this.socket.emit('allGames', [...Object.values(GAMES_LOBBY)]);
        });

        this._registerListener('tryJoinGame', (gameId) => {
            // Acquire lock for this gameId
            if (gameLocks.get(gameId)) {
                this.socket.emit('tryJoinGame_FAILURE');
                return;
            }
            gameLocks.set(gameId, true);

            try {
                const game = GAMES_LOBBY[gameId];
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
                game.playersNotionsMask[this._userId] = user.config.notionsMask;
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
