const { Server, Socket } = require('socket.io');

const { GameLobby, GameID } = require("../../../shared/types");
const { GameLobbyState } = require("../../../shared/types/enums/game-lobby-state.enum");

const { GAMES, gameLocks, GUEST_ROOM, ERGO_ROOM, CHILD_ROOM } = require("../app-client.helpers");

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
            this.socket.emit('allGames', [...GAMES.values()]);
        });

        this._registerListener('openGame', () => {
            /** @type {GameLobby} */
            const newGame = {
                gameId: `g${Date.now()}`,
                name: "",
                playersId: [],
                state: GameLobbyState.WAITING,
                playersNotionsMask: {},
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
        this.socket.join(GUEST_ROOM);

        this.changeRole(new (require("./guest.role")).GuestRole_Impl(
            this.io,
            this.socket,
            this.changeRole
        ));
    }
}



module.exports = { ErgoRole_Impl };
