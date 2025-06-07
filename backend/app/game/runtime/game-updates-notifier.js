"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUpdatesNotifier = void 0;
class GameUpdatesNotifier {
    constructor(io) {
        this.io = io;
    }
    onNewQuestionForPlayer(playerId, question) {
        this.io.to(playerId).emit('newQuestion', question);
    }
    onPlayerChangedLane(playerId, lane) {
        this.io.emit('playerChangedLane', playerId, lane);
    }
    onPlayerShot(playerId, projectile) {
        this.io.emit('newProjectile', projectile);
    }
    onPlayerScoreUpdated(playerId, newScore) {
        this.io.to(playerId).emit('scoreUpdated', newScore);
    }
    onEnemyAdded(enemy) {
        this.io.emit('enemyAdded', enemy);
    }
    onEnemyKilled(projectile, enemy) {
        this.io.emit('enemyKilled', projectile, enemy);
    }
    onPlayerParalyzed(playerId) {
        this.io.emit('playerParalyzed', playerId);
    }
    onPlayerDeparalyzed(playerId) {
        this.io.emit('playerDeparalyzed', playerId);
    }
}
exports.GameUpdatesNotifier = GameUpdatesNotifier;
