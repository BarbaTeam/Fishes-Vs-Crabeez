"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUpdatesNotifier = void 0;
class GameUpdatesNotifier {
    constructor(io, broadcast) {
        this.io = io;
        this.broadcast = broadcast;
    }
    onStartup(startupPackage) {
        console.log(`[NOTIFIER] : Sending startup package ${startupPackage}\n\n`);
        this.broadcast.emit('gameStartup', startupPackage);
    }
    onPlayerChangedLane(playerId, num_lane, x, y) {
        console.log(`[NOTIFIER] : Player : ${playerId} changed lane to number ${num_lane} (${x}, ${y})\n\n`);
        this.broadcast.emit('playerChangedLane', { playerId: playerId, x: x, y: y });
    }
    onPlayerChangedPosition(playerId, x, y) {
        console.log(`[NOTIFIER] : Player : ${playerId} stayed on his lane but moved to (${x}, ${y})\n\n`);
        this.broadcast.emit('playerChangedPosition', { playerId: playerId, x: x, y: y });
    }
    onPlayerShot(playerId, projectile) {
        console.log(`[NOTIFIER] : Player : ${playerId} shot a projectile`);
        this.broadcast.emit('newProjectile', { playerId: playerId, projectile: projectile.toJSON() });
    }
    onEnemyAdded(enemy) {
        console.log(`[NOTIFIER] : A new enemy spawned\n\n`);
        this.broadcast.emit('enemyAdded', enemy.toJSON());
    }
    onEnemyHit(projectile, enemyId) {
        console.log(`[NOTIFIER] : An enemy has been hit`);
        this.broadcast.emit('enemyHit', { projectile: projectile.toJSON(), enemyId: enemyId });
    }
    onEnemyKilled(projectile, enemyId) {
        console.log(`[NOTIFIER] : An enemy has been slain`);
        this.broadcast.emit('enemyKilled', { projectile: projectile.toJSON(), enemyId: enemyId });
    }
    onEnemyDespawned(enemyId) {
        console.log(`[NOTIFIER] : An enemy has been despawned`);
        this.broadcast.emit('enemyDespawned', enemyId);
    }
    onPlayerParalysed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralysed !\n\n`);
        this.broadcast.emit('playerParalysed', playerId);
    }
    onPlayerDeparalysed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !\n\n`);
        this.broadcast.emit('playerDeparalysed', playerId);
    }
    onScoreUpdated(newScore) {
        console.log(`[NOTIFIER] : new score for all players : ${newScore}`);
        this.broadcast.emit('scoreUpdated', newScore);
    }
    onHealthUpdated(newHealth) {
        console.log(`[NOTIFIER] : Players took damage, there is the new health ${newHealth}`);
        this.broadcast.emit('healthUpdated', newHealth);
    }
    onNewWave(waveCounter) {
        console.log(`[NOTIFIER] : New wave incoming ! n°${waveCounter}`);
        this.broadcast.emit('newWave', waveCounter);
    }
    onGameEnd() {
        console.log(`[NOTIFIER] : Game ended !`);
        this.broadcast.emit('gameEnded');
    }
    onNewQuestionForPlayer(playerId, question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}\n\n`);
        this.io.to(playerId).emit('newQuestion', question);
    }
    onPlayerScoreUpdated(playerId, newScore) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}`);
        this.io.to(playerId).emit('playerScoreUpdated', newScore);
    }
}
exports.GameUpdatesNotifier = GameUpdatesNotifier;
