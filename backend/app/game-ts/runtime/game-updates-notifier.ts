import { Server } from 'socket.io';

import { Question, UserID } from '../../shared/types';

import { Projectile } from '../model/game-engine/projectile';
import { Enemy } from '../model/game-engine/enemies/enemy';



export class GameUpdatesNotifier {
    constructor(
        private io: Server,
    ) {}

    public onNewQuestionForPlayer(playerId: UserID, question: Question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}`);
        this.io.to(playerId).emit('newQuestion', question);
    }

    public onPlayerChangedLane(playerId: UserID, lane: number) {
        console.log(`[NOTIFIER] : Player : ${playerId} changed lane to number ${lane}`);
        this.io.emit('playerChangedLane', playerId, lane);
    }

    public onPlayerShot(playerId: UserID, projectile: Projectile) {
        console.log(`[NOTIFIER] : Player : ${playerId} shot a projectile`);
        this.io.emit('newProjectile', projectile);
    }

    public onPlayerScoreUpdated(playerId: UserID, newScore: number) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}`);
        this.io.to(playerId).emit('scoreUpdated', newScore);
    }

    public onEnemyAdded(enemy: Enemy){
        console.log(`[NOTIFIER] : A new enemy spawned`);
        this.io.emit('enemyAdded', enemy);
    }

    public onEnemyKilled(projectile : Projectile, enemy: Enemy) {
        console.log(`[NOTIFIER] : An enemy has been slain`);
        this.io.emit('enemyKilled', projectile, enemy);
    }

    public onPlayerParalyzed(playerId: UserID) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralyzed !`);
        this.io.emit('playerParalyzed', playerId);
    }

    public onPlayerDeparalyzed(playerId: UserID) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !`);
        this.io.emit('playerDeparalyzed', playerId);
    }
}
