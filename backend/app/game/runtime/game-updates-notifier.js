"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUpdatesNotifier = void 0;
class GameUpdatesNotifier {
    constructor(
    //private io: Server|Namespace|BroadcastOperator<any, any>,
    io, broadcast) {
        this.io = io;
        this.broadcast = broadcast;
    }
    onNewQuestionForPlayer(playerId, question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}\n\n`);
        this.io.to(playerId).emit('newQuestion', question);
    }
    onPlayerScoreUpdated(playerId, newScore) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}`);
        this.io.to(playerId).emit('scoreUpdated', newScore);
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
    onEnemyKilled(projectile, enemy) {
        console.log(`[NOTIFIER] : An enemy has been slain`);
        this.broadcast.emit('enemyKilled', { projectile: projectile.toJSON(), enemy: enemy.toJSON() });
    }
    onPlayerParalyzed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralyzed !\n\n`);
        this.broadcast.emit('playerParalyzed', playerId);
    }
    onPlayerDeparalyzed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !\n\n`);
        this.broadcast.emit('playerDeparalyzed', playerId);
    }
}
exports.GameUpdatesNotifier = GameUpdatesNotifier;
