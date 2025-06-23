const { Server, Socket } = require('socket.io');

const { GameLobby, GameID } = require("../../../shared/types");
const { GameLobbyState } = require("../../../shared/types/enums/game-lobby-state.enum");

const { GameRuntime } = require('../../../game/runtime');
const { RUNNING_GAMES } = require('../../../game/running-games');

const { GAMES, ERGO_ROOM, CHILD_ROOM } = require("../app-client.helpers");

const { AppClientRole } = require('./app-client-role.enum');
const { ErgoRole_Impl } = require("./ergo.role");



/**
 * Concrete state for GameMasters (inherits from Ergo)
 */
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
        super.setUpListeners(); // Set up Ergo listeners

        this._registerListener('startGame', () => {
            const game = GAMES.get(this._gameId);
            game.state = GameLobbyState.RUNNING;

            this.io.to(ERGO_ROOM).to(CHILD_ROOM).except(this._gameId).emit('gameStarted', game.gameId);

            this.io.to(this._gameId).emit('startCountdown');
            setTimeout(() => {
                this.io.to(this._gameId).except(ERGO_ROOM).emit('endCountdown', () => {
                    RUNNING_GAMES[game.gameId] = new GameRuntime(this.io, game);
                });
            }, 5000);
        });

        this._registerListener('updateGame', (update) => {
            // TODO : Enabling game master to update game

            const game = GAMES.get(this._gameId);
            if (game.state === GameLobbyState.WAITING) {
                // ...
                return;
            }

            //const gameRuntime = RUNNING_GAMES[this._gameId].receiver.onErgoUpdate(update);
        });

        this._registerListener('unspyGame', () => {
            // TODO : Allowing game masters to unspy a game w/o closing it
        })

        this._registerListener('closeGame', () => {
            const oldGameId = this._gameId;
            this.unspyGame();
            GAMES.delete(oldGameId);
            this.io.to(oldGameId).emit('forcedGameLeave');
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

        this.changeRole(new (require("./ergo.role")).ErgoRole_Impl(
            this.io,
            this.socket,
            this.changeRole
        ));
    }
}



module.exports = { GameMasterRole_Impl };
