const { Server, Socket } = require('socket.io');

const { UserID, GameID } = require("../../../shared/types");

const { CONNECTED_USERS_ID, GAMES } = require("../app-client.helpers");

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require('./app-client.role');
const { ChildRole_Impl } = require('./child.role');



/**
 * Concrete state for Players (inherits from Child)
 */
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
        let idxUser = CONNECTED_USERS_ID.indexOf(this._userId);
        if (idxUser !== -1) {
            CONNECTED_USERS_ID.splice(idxUser, 1);
        }

        this.io.to(GUEST_ROOM).emit('userDisconnected', this._userId);

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

        this.changeRole(new (require("./child.role")).ChildRole_Impl(
            this.io,
            this.socket,
            this.changeRole,
            this._userId
        ));
    }
}



module.exports = { PlayerRole_Impl };
