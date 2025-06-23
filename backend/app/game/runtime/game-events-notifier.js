const { Server } = require('socket.io');

const { UserID } = require('../../shared/types');

// const { Projectile } = require('../types');



class GameEventsNotifier {
    /**
     * @param {Server} io
     */
    contructor(io) {
        this.io = io;
    }

    /**
     * @param {UserID} playerId
     * @param {number} lane
     */
    onPlayerMoved(playerId, lane) {}

    /**
     * @param {UserID} playerId
     * @param {*} bubble
     */
    onPlayerShot(playerId, bubble) {}

    /**
     * @param {UserID} playerId
     */
    onPlayerJoined(playerId) {}

    /**
     * @param {UserID} playerId
     * @param {number} score
     */
    onPlayerScoreUpdated(playerId, newScore) {}
}



module.exports = { GameEventsNotifier };