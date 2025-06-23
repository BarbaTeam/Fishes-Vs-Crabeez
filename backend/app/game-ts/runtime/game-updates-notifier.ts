import { Server, BroadcastOperator, Namespace } from 'socket.io';

import { Question, UserID } from '../../shared/types';

import { Projectile } from '../model/game-engine/projectile';
import { Enemy } from '../model/game-engine/enemies/enemy';



export class GameUpdatesNotifier {
    constructor(
        //private io: Server|Namespace|BroadcastOperator<any, any>,
        private io: Server,
        private broadcast: BroadcastOperator<any, any>,
    ) {}
    
    public onNewQuestionForPlayer(playerId: UserID, question: Question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}\n\n`);
        this.io.to(playerId).emit('newQuestion', question);
    }

    public onPlayerScoreUpdated(playerId: UserID, newScore: number) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}`);
        this.io.to(playerId).emit('scoreUpdated', newScore);
    }

    public onStartup(startupPackage: any) {
        console.log(`[NOTIFIER] : Sending startup package ${startupPackage}\n\n`);
        this.broadcast.emit('gameStartup', startupPackage);
    }

    public onPlayerChangedLane(playerId: UserID, lane: number) {
        console.log(`[NOTIFIER] : Player : ${playerId} changed lane to number ${lane}\n\n`);
        this.broadcast.emit('playerChangedLane', {playerId : playerId, lane : lane});
    }

    public onPlayerShot(playerId: UserID, projectile: Projectile) {
        console.log(`[NOTIFIER] : Player : ${playerId} shot a projectile`);
        this.broadcast.emit('newProjectile', {playerId: playerId, projectile: projectile.toJSON()});
    }

    public onEnemyAdded(enemy: Enemy){
        console.log(`[NOTIFIER] : A new enemy spawned\n\n`);
        this.broadcast.emit('enemyAdded', enemy.toJSON());
    }

    public onEnemyKilled(projectile : Projectile, enemy: Enemy) {
        console.log(`[NOTIFIER] : An enemy has been slain`);
        this.broadcast.emit('enemyKilled', {projectile: projectile.toJSON(), enemy: enemy.toJSON()});
    }

    public onPlayerParalyzed(playerId: UserID) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralyzed !\n\n`);
        this.broadcast.emit('playerParalyzed', playerId);
    }

    public onPlayerDeparalyzed(playerId: UserID) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !\n\n`);
        this.broadcast.emit('playerDeparalyzed', playerId);
    }
}
