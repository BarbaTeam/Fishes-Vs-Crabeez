import { Server } from 'socket.io';

import { UserID } from '../../shared/types';

import { Projectile } from '../model/game-engine/projectile';
import { Enemy } from '../model/game-engine/enemies/enemy';



export class GameUpdatesNotifier {
    constructor(
        private io: Server,
    ) {}

    public onPlayerChangedLane(playerId: UserID, lane: number) {
        this.io.to(playerId).emit('playerChangedLane', lane);
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
}
