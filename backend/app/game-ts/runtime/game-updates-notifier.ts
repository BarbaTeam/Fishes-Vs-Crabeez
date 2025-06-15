import { Server, BroadcastOperator } from 'socket.io';

import { Question, UserID } from '../../shared/types';

import { Projectile } from '../model/game-engine/projectile';
import { Enemy } from '../model/game-engine/enemies/enemy';



export class GameUpdatesNotifier {
    constructor(
        private io: Server,
        private broadcast: BroadcastOperator<any, any>,
    ) {}

    public onStartup(startupPackage: any) {
        console.log(`[NOTIFIER] : Sending startup package ${startupPackage}\n\n`);
        this.broadcast.emit('gameStartup', startupPackage);
    }

    public onPlayerChangedLane(playerId: UserID, num_lane: number, x: number, y: number) {
        console.log(`[NOTIFIER] : Player : ${playerId} changed lane to number ${num_lane} (${x}, ${y})\n\n`);
        this.broadcast.emit('playerChangedLane', {playerId : playerId, x : x, y: y});
    }

    public onPlayerChangedPosition(playerId: UserID, x: number, y: number) {
        console.log(`[NOTIFIER] : Player : ${playerId} stayed on his lane but moved to (${x}, ${y})\n\n`);
        this.broadcast.emit('playerChangedPosition', {playerId : playerId, x : x, y: y});
    }

    public onPlayerShot(playerId: UserID, projectile: Projectile) {
        console.log(`[NOTIFIER] : Player : ${playerId} shot a projectile`);
        this.broadcast.emit('newProjectile', {playerId: playerId, projectile: projectile.toJSON()});
    }

    public onEnemyAdded(enemy: Enemy){
        console.log(`[NOTIFIER] : A new enemy spawned\n\n`);
        this.broadcast.emit('enemyAdded', enemy.toJSON());
    }

    public onEnemyHit(projectile : Projectile, enemyId: string, enemyHealth: number) {
        console.log(`[NOTIFIER] : An enemy has been hit`);
        this.broadcast.emit('enemyHit', {projectile: projectile.toJSON(), enemyId: enemyId, enemyHealth: enemyHealth});
    }

    public onEnemyKilled(projectile : Projectile, enemyId: string) {
        console.log(`[NOTIFIER] : An enemy has been slain`);
        this.broadcast.emit('enemyKilled', {projectile: projectile.toJSON(), enemyId: enemyId});
    }

    public onEnemyDespawned(enemyId: string) {
        console.log(`[NOTIFIER] : An enemy has been despawned`);
        this.broadcast.emit('enemyDespawned', enemyId);
    }
    
    public onPlayerParalysed(playerId: UserID) {
        console.log(`[NOTIFIER] : Player ${playerId} is paralysed !\n\n`);
        this.broadcast.emit('playerParalysed', playerId);
    }

    public onPlayerDeparalysed(playerId: UserID) {
        console.log(`[NOTIFIER] : Player ${playerId} freed himself !\n\n`);
        this.broadcast.emit('playerDeparalysed', playerId);
    }

    public onScoreUpdated(newScore: number) {
        console.log(`[NOTIFIER] : new score for all players : ${newScore}`);
        this.broadcast.emit('scoreUpdated', newScore);
    }

    public onHealthUpdated(newHealth: number) {
        console.log(`[NOTIFIER] : Players took damage, there is the new health ${newHealth}`);
        this.broadcast.emit('healthUpdated', newHealth);
    }

    public onNewWave(waveCounter: number) {
        console.log(`[NOTIFIER] : New wave incoming ! n°${waveCounter}`);
        this.broadcast.emit('newWave', waveCounter);
    }

    public onBossWave(bossName: string) {
        console.log(`[NOTIFIER] : BOSS wave incoming ! It's ${bossName}`);
        this.broadcast.emit('bossWave', bossName);
    }

    public onGameEnd(){
        console.log(`[NOTIFIER] : Game ended !`);
        this.broadcast.emit('gameEnded');
    }

    public onNewQuestionForPlayer(playerId: UserID, question: Question) {
        console.log(`[NOTIFIER] : New question sent to player : ${playerId}\n\n`);
        this.io.to(playerId).emit('newQuestion', question);
    }

    public onPlayerScoreUpdated(playerId: UserID, newScore: number) {
        console.log(`[NOTIFIER] : Player ${playerId}'s new score : ${newScore}`);
        this.io.to(playerId).emit('playerScoreUpdated', newScore);
    }
}
