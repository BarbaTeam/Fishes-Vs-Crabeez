"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameUpdatesNotifier = void 0;
class GameUpdatesNotifier {
    constructor(io) {
        this.io = io;
    }
    onStartup(startupPackage) {
        console.log(`[NOTIFIER] : Sending startup package ${startupPackage}\n\n`);
        this.io.emit('gameStartup', startupPackage);
    }
    onNewQuestionForPlayer(playerId, question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}\n\n`);
        this.io.to(playerId).emit('newQuestion', question);
    }
    onPlayerChangedLane(playerId, lane) {
        console.log(`[NOTIFIER] : Player : ${playerId} changed lane to number ${lane}\n\n`);
        this.io.emit('playerChangedLane', playerId, lane);
    }
    onPlayerShot(playerId, projectile) {
        console.log(`[NOTIFIER] : Player : ${playerId} shot a projectile\n\n`);
        this.io.emit('newProjectile', { playerId: playerId, projectile: projectile.toJSON() });
    }
    onPlayerScoreUpdated(playerId, newScore) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}\n\n`);
        this.io.to(playerId).emit('scoreUpdated', newScore);
    }
    onEnemyAdded(enemy) {
        console.log(`[NOTIFIER] : A new enemy spawned\n\n`);
        this.io.emit('enemyAdded', enemy.toJSON());
    }
    onEnemyKilled(projectile, enemy) {
        console.log(`[NOTIFIER] : An enemy has been slain\n\n`);
        this.io.emit('enemyKilled', { projectile: projectile.toJSON(), enemy: enemy.toJSON() });
    }
    onPlayerParalyzed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralyzed !\n\n`);
        this.io.emit('playerParalyzed', playerId);
    }
    onPlayerDeparalyzed(playerId) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !\n\n`);
        this.io.emit('playerDeparalyzed', playerId);
    }
}
exports.GameUpdatesNotifier = GameUpdatesNotifier;
