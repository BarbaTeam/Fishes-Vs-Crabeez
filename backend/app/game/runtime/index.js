////////////////////////////////////////////////////////////////////////////////
// Imports (CommonJS) :
////////////////////////////////////////////////////////////////////////////////

const { stopRunningGame } = require('../../game-runner');
const { processGameLog } = require('../../stats');

const { GameUpdatesNotifier } = require('./game-updates-notifier');
const { GameActionsReceiver } = require('./game-actions-receiver');
const { GameLogAccumulator } = require('../model/game-log-accumulator');
const { GameModel } = require('../model');



////////////////////////////////////////////////////////////////////////////////
// GameRuntime Class :
////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {import('socket.io').Server} Server
 * @typedef {import('../../shared/types').Game} Game
 */

class GameRuntime {
    /**
     * @readonly
     * @type {GameUpdatesNotifier}
     */
    notifier;

    /**
     * @readonly
     * @type {GameModel}
     */
    model;

    /**
     * @readonly
     * @type {GameActionsReceiver}
     */
    receiver;

    /**
     * @readonly
     * @type {GameLogAccumulator}
     */
    accumulator;

    /**
     * @type {NodeJS.Timeout | undefined}
     */
    timeout;

    /**
     * @param {Server} io
     * @param {Game} game
     */
    constructor(io, game) {
        this.notifier    = new GameUpdatesNotifier(io, io.to(game.gameId));
        this.accumulator = new GameLogAccumulator(game);
        this.model       = new GameModel(this.notifier, game, this.accumulator);
        this.receiver    = new GameActionsReceiver(this.model);

        const maxDurationInMin = game.gameConfig.maxDuration;
        if (maxDurationInMin !== "inf") {
            this.timeout = setTimeout(
                () => this.onGameEnd(),
                maxDurationInMin * 60000 // 1 min = 60000 ms
            );
        }
    }

    /**
     * Runs a single game frame.
     */
    runOneFrame() {
        if (this.model.hasEnded || this.model.game.playersId.length === 0) {
            this.onGameEnd();
            return;
        }
        this.model.runOneFrame();
    }

    /**
     * Ends the game and performs cleanup.
     */
    onGameEnd() {
        if (this?.timeout) this.timeout.close();
        this.notifier.onGameEnd();
        processGameLog(this.accumulator.gamelog);

        console.log(stopRunningGame);
        stopRunningGame(this.model.game.gameId);
    }

    /**
     * Forces the game to end prematurely.
     */
    onForcedGameEnd() {
        if (this?.timeout) this.timeout.close();
        this.notifier.onGameEnd();
        stopRunningGame(this.model.game.gameId);
    }
}



////////////////////////////////////////////////////////////////////////////////
// Exports :
////////////////////////////////////////////////////////////////////////////////

module.exports = {
    GameRuntime
};