import { UserID } from "../../../shared/types";

import { GameUpdatesNotifier } from "../../runtime/game-updates-notifier";
import { GameModel } from "..";

import { EventID, EventKind } from "../events-handler";

import { Enemy } from "./enemies/enemy";
import { Player } from "./player";
import { Projectile } from "./projectile";

import { LANES, PLAYER_COLORS, VIRTUAL_WIDTH } from "./variables";



export class GameEngine {
    public players: Record<UserID, Player> = {};
    public projectiles: Projectile[] = [];
    public enemies: Enemy[] = [];
    private score = 0;
    private currWaveEventId?: EventID;

    constructor(
        private model: GameModel,
        public notifier: GameUpdatesNotifier,
        playersId: UserID[],
    ) {
        for (const [i, playerId] of playersId.entries()) {
            this.registerPlayer(playerId, PLAYER_COLORS[i], i);
        }
    }

    private registerPlayer(playerId: UserID, color: "yellow" | "blue" | "red", laneIndex: number): void {
        const player = new Player(playerId, color, LANES[laneIndex]);
        this.players[playerId] = player;
    }

    public handleMove(playerId: UserID, direction: string): void {
        const player = this.players[playerId];
        if (!player) return;

        if (direction === 'UP') player.moveUp();
        else if (direction === 'DOWN') player.moveDown();

        this.notifier.onPlayerChangedLane(playerId, player.lane.num, player.x, player.y);
        this.notifyAllLanes();
    }

    private notifyAllLanes(): void {
        for (const lane of LANES) {
            for (const player of lane.getPlayers()) {
                this.notifier.onPlayerChangedPosition(player.id, player.x, player.y);
            }
        }
    }

    public handleShoot(playerId: UserID): void {
        const player = this.players[playerId];
        if (!player) return;

        const projectile = new Projectile(player);
        this.projectiles.push(projectile);
        this.notifier.onPlayerShot(playerId, projectile);
    }

    public spawnEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
        this.notifier.onEnemyAdded(enemy);
    }

    public paralysePlayer(playerId: UserID): void {
        const player = this.players[playerId];
        if (!player) return;

        player.isParalysed = true;
        this.notifier.onPlayerParalysed(playerId);
    }

    public deparalysePlayer(playerId: UserID): void {
        const player = this.players[playerId];
        if (!player) return;

        player.isParalysed = false;
        this.notifier.onPlayerDeparalysed(playerId);
    }

    private checkCollision(obj1: { x: number, y: number, width: number, height: number }, obj2: { x: number, y: number, width: number, height: number }): boolean {
        return !(
            obj1.x + obj1.width / 2 < obj2.x - obj2.width / 2 ||
            obj1.x - obj1.width / 2 > obj2.x + obj2.width / 2 ||
            obj1.y + obj1.height / 2 < obj2.y - obj2.height / 2 ||
            obj1.y - obj1.height / 2 > obj2.y + obj2.height / 2
        );
    }

    private processEnemy(enemy: Enemy): void {
        enemy.update();
        if (enemy.x < 10) {
            this.kill(enemy);
            this.notifier.onEnemyDespawned(enemy.id);
        }
    }

    private processProjectile(projectile: Projectile): void {
        projectile.update();
        if (projectile.x > VIRTUAL_WIDTH) {
            projectile.destroy();
        }
    }

    private detectCollisions(): void {
        for (const projectile of this.projectiles) {
            if (projectile.markedForDeletion) continue;

            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;

                if (this.checkCollision(enemy, projectile)) {
                    this.kill(enemy);
                    projectile.destroy();
                    const player = projectile.player;
                    this.score += enemy.score;

                    this.notifier.onEnemyKilled(projectile, enemy);
                    this.notifier.onScoreUpdated(this.score);
                    return; 
                }
            }
        }
    }

    public kill(enemy: Enemy): void {
        enemy.destroy();
    }

    public getAllPlayers(): Player[] {
        return Object.values(this.players).map(player => player.toJSON());
    }

    public update(): void {
        this.spawnNextWaveIfNeeded();

        this.enemies.forEach(enemy => this.processEnemy(enemy));
        this.projectiles.forEach(projectile => this.processProjectile(projectile));

        this.detectCollisions();

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => e.alive);
    }

    private spawnNextWaveIfNeeded(): void {
        const noMoreEnemies = this.enemies.length === 0;
        const currentEventEnded = !this.currWaveEventId || !this.model.eventsHandler.aliveEvents[this.currWaveEventId];

        if (noMoreEnemies && currentEventEnded) {
            const PLACEHOLDER_DIFFICULTY = 10;
            this.currWaveEventId = this.model.eventsHandler.spawnEvent(EventKind.WAVE, PLACEHOLDER_DIFFICULTY);
            console.log("Spawning new wave event");
        }
    }
}
