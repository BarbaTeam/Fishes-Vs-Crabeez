"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUpdatesNotifier = void 0;
class GameUpdatesNotifier {
    constructor(io) {
        this.io = io;
    }
    onNewQuestionForPlayer(playerId, question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}`);
        this.io.to(playerId).emit('newQuestion', question);
    }
    onPlayerChangedLane(playerId, lane) {
        console.log(`[NOTIFIER] : Player : ${playerId} changed lane to number ${lane}`);
        this.io.emit('playerChangedLane', playerId, lane);
    }
    onPlayerShot(playerId, projectile) {
        console.log(`[NOTIFIER] : Player : ${playerId} shot a projectile`);
        this.io.emit('newProjectile', projectile);
    }
    onPlayerScoreUpdated(playerId, newScore) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}`);
        this.io.to(playerId).emit('scoreUpdated', newScore);
    }
    onEnemyAdded(enemy) {
        console.log(`[NOTIFIER] : A new enemy spawned`);
        this.io.emit('enemyAdded', enemy);
    }
    onEnemyKilled(projectile, enemy) {
        console.log(`[NOTIFIER] : An enemy has been slain`);
        this.io.emit('enemyKilled', projectile, enemy);
    }
    onPlayerParalyzed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralyzed !`);
        this.io.emit('playerParalyzed', playerId);
    }
    onPlayerDeparalyzed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !`);
        this.io.emit('playerDeparalyzed', playerId);
    }
}
exports.GameUpdatesNotifier = GameUpdatesNotifier;
