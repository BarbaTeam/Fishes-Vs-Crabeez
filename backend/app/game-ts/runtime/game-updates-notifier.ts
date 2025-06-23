import { Server } from 'socket.io';

import { Question, UserID } from '../../shared/types';

import { Projectile } from '../model/game-engine/projectile';
import { Enemy } from '../model/game-engine/enemies/enemy';



export class GameUpdatesNotifier {
    constructor(
        private io: Server,
    ) {}

    public onNewQuestionForPlayer(playerId: UserID, question: Question) {
        this.io.to(playerId).emit('newQuestion', question);
    }

    public onPlayerChangedLane(playerId: UserID, lane: number) {
        this.io.emit('playerChangedLane', playerId, lane);
    }

    public onPlayerShot(playerId: UserID, projectile: Projectile) {
        this.io.emit('newProjectile', projectile);
    }

    public onPlayerScoreUpdated(playerId: UserID, newScore: number) {
        this.io.to(playerId).emit('scoreUpdated', newScore);
    }

    public onEnemyAdded(enemy: Enemy){
        this.io.emit('enemyAdded', enemy);
    }

    public onEnemyKilled(projectile : Projectile, enemy: Enemy) {
        this.io.emit('enemyKilled', projectile, enemy);
    }

    public onPlayerParalyzed(playerId: UserID) {
        this.io.emit('playerParalyzed', playerId);
    }

    public onPlayerDeparalyzed(playerId: UserID) {
        this.io.emit('playerDeparalyzed', playerId);
    }
}
