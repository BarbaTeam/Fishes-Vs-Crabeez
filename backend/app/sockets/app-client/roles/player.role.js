const { Server, Socket } = require('socket.io');

const { UserID, GameID } = require("../../../shared/types");


const { CONNECTED_USERS_ID, GAMES, GUEST_ROOM, ERGO_ROOM, CHILD_ROOM } = require("../app-client.helpers");

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require('./app-client.role');
const { ChildRole_Impl } = require('./child.role');

const { RUNNING_GAMES } = require('../../../game-runner');

/**
 * Concrete state for Players (inherits from Child)
 */
class PlayerRole_Impl extends ChildRole_Impl {
    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(role: AppClientRole_Impl) => void} changeRole
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

        this._registerListener('requestStartup', () => {
            console.log(GAMES[this._gameId].playersId);
            if (RUNNING_GAMES[this._gameId] === undefined) {
                console.log(GAMES[this._gameId].playersId);
                console.log("[CLIENT Warn] Startup package request denied as all player aren't yet connected");
                return;
            }
            console.log("[CLIENT] Startup package requested");
            RUNNING_GAMES[this._gameId].receiver.onStartupRequested();
        });

        this._registerListener('sendAnswer', (answer) => {
            if (RUNNING_GAMES[this._gameId] === undefined) {
                // Should never happen
                console.log("[CLIENT Warn] Answer ignored as game is not running");
                return;
            }
            console.log(`[CLIENT] answer received : ${answer}`);
            RUNNING_GAMES[this._gameId].receiver.onAnswerReceived(this._userId, answer);
        });

        this._registerListener('changeLane', (direc) => {
            if (!["UP", "DOWN"].includes(direc)) {
                throw new Error(`Invalid lane changement direction ${direc}`);
            }
            if (RUNNING_GAMES[this._gameId] === undefined) {
                // Should never happen
                console.log("[CLIENT Warn] Lane changement ignored as game is not running");
                return;
            }
            RUNNING_GAMES[this._gameId].receiver.onLaneChanged(this._userId, direc);
        });

        this._registerListener('leaveGame', () => {
            const leftGameId = this._gameId;
            this.leaveGame();

            const gameToLeave = GAMES[leftGameId];
            if (!gameToLeave) {
                return;
            }

            let playerToRemoveIdx = gameToLeave.playersId.indexOf(this._userId);
            if (playerToRemoveIdx === -1) {
                // TODO : Preventing users to do dumb shit OR finding a way to recover from it.
                throw new Error("Should never happen if the user act normally");
            }
            gameToLeave.playersId.splice(playerToRemoveIdx, 1);
            delete gameToLeave.playersConfig[this._userId];

            this.io.to(leftGameId).to(ERGO_ROOM).to(CHILD_ROOM).emit('gameUpdated', gameToLeave);
        });
    }

    /**
     * @override
     */
    disconnect() {
        // Remove from lobby
        const game = GAMES[this._gameId];
        if (!game) {
            console.warn(`[WARN :: AppClient::_handleDisconnectAsPlayer] No game found for gameId ${this._gameId}`);
            return;
        }

        let idx = game.playersId.indexOf(this._userId);
        if (idx === -1) {
            // TODO : Preventing users to do dumb shit OR finding a way to recover from it.
            throw new Error("Should never happen if the user act normally");
        }
        game.playersId.splice(idx, 1);
        delete game.playersConfig[this._userId];

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
    /**
     * @override
     * @returns {string}
     */
    get gameId() {
        return this._gameId;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Transitions :

    /**
     * @private
     */
    leaveGame() {
        console.log(`[DEBUG :: AppClient::leaveGame] Client {id=${this.socket.id} ; role=${this.role}} transitionning to CHILD ...`);

        this._cleanListeners();
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
