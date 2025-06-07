const { Server } = require('socket.io');

const { UserID } = require('../../shared/types');

const { Projectile } = require('../model/game-engine/projectile');



class GameUpdatesNotifier {
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
    onPlayerChangedLane(playerId, lane) {
        this.io.send('playerChangedLane', { playerId, lane })
    }

    /**
     * @param {UserID} playerId
     * @param {Projectile} projectile
     */
    onPlayerShot(playerId, projectile) {
        this.io.send('newProjectile', projectile);
    }

    /**
     * @param {UserID} playerId
     * @param {number} score
     */
    onPlayerScoreUpdated(playerId, newScore) {
        this.io.to(playerId).send('scoreUpdated', newScore);
    }
}



module.exports = { GameUpdatesNotifier };