const { Server } = require('socket-io');

const { GameLobby } = require('../../shared/types');

const { GameActionsReceiver } = require('./game-actions-receiver');
const { GameEventsNotifier } = require('./game-events-notifier');



class GameRuntime {
    /**
     * @param {Server} io
     * @param {GameLobby} gameLobby
     */
    constructor (io, gameLobby) {
        this.receiver = new GameActionsReceiver(model);
        this.model    = new GameModel(notifier);
        this.notifier = new GameEventsNotifier(io);
    }

    // TODO : Adding end for game
    runOneFrame() {
        // ...
    }
}



module.exports = { GameRuntime };