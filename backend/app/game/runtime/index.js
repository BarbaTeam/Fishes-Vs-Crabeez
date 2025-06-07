const { Server } = require('socket.io');

const { GameLobby } = require('../../shared/types');

const { GameActionsReceiver } = require('./game-actions-receiver');
const { GameUpdatesNotifier } = require('./game-updates-notifier');
const { GameModel } = require('../model');


class GameRuntime {
    /**
     * @param {Server} io
     * @param {GameLobby} gameLobby
     */
    constructor (io, gameLobby) {
        this.notifier = new GameUpdatesNotifier(io);
        this.model    = new GameModel(this.notifier, gameLobby);
        this.receiver = new GameActionsReceiver(this.model);
    }

    // TODO : Adding end for game
    runOneFrame() {
        this.model.runOneFrame();
    }
}



module.exports = { GameRuntime };