const { Server, Socket } = require('socket.io');

const { GameID } = require("../../../shared/types");
const { GameState } = require("../../../shared/types/enums/game-state.enum");

const { GameRuntime } = require('../../../game/runtime');

const { registerRunningGame, RUNNING_GAMES } = require('../../../game-runner');

const { GAMES, ERGO_ROOM, CHILD_ROOM } = require("../app-client.helpers");

const { AppClientRole } = require('./app-client-role.enum');
const { AppClientRole_Impl } = require('./app-client.role');
const { ErgoRole_Impl } = require("./ergo.role");



/**
 * Concrete state for GameMasters (inherits from Ergo)
 */
class GameMasterRole_Impl extends ErgoRole_Impl {

    /**
     * @param {Server} io
     * @param {Socket} socket
     * @param {(role: AppClientRole_Impl) => void} changeRole
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
            const game = GAMES[this._gameId];
            game.state = GameState.RUNNING;

            this.io.to(ERGO_ROOM).to(CHILD_ROOM).emit('gameStarted', game.gameId);

            this.io.to(this._gameId).emit('startCountdown');
            setTimeout(() => {
                this.io.to(this._gameId).except(ERGO_ROOM).emit('endCountdown', () => {
                    registerRunningGame(game.gameId, new GameRuntime(this.io, game));
                });
            }, 5000);
        });

        this._registerListener('updateGame', (gameUpdate) => {
            GAMES[this._gameId] = gameUpdate;
            this.socket.to(ERGO_ROOM).to(CHILD_ROOM).emit('gameUpdated', gameUpdate)

            const game = GAMES[this._gameId];
            if (game.state === GameState.RUNNING) {
                // TODO : ...
                return;
            }
        });

        this._registerListener('unspyGame', () => {
            delete GAMES[this._gameId].masterId;
            this.unspyGame();
        })

        this._registerListener('closeGame', () => {
            const oldGameId = this._gameId;
            this.unspyGame();
            delete GAMES[oldGameId];
            const currGame = RUNNING_GAMES[oldGameId];
            if (currGame) {
                if (process.env.TEST_E2E) {
                    currGame.onGameEnd();
                } else {
                    currGame.onForcedGameEnd();
                }
            }
            this.io.to(ERGO_ROOM).to(CHILD_ROOM).emit('gameClosed', oldGameId);
        });
    }

    /**
     * @override
     */
    disconnect() {
        const game = GAMES[this._gameId];
        if (game) {
            // 1) Notify players to leave the game
            this.io.to(this._gameId).emit('leaveGame');
            // 2) Remove the masterId from the game he created
            delete GAMES[this._gameId].masterId;
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

        this._cleanListeners();
        this.socket.leave(this._gameId);

        this.changeRole(new (require("./ergo.role")).ErgoRole_Impl(
            this.io,
            this.socket,
            this.changeRole
        ));
    }
}



module.exports = { GameMasterRole_Impl };
