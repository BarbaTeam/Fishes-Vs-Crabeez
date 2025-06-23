import { UserID } from "../../../shared/types";

import { GameUpdatesNotifier } from "../../runtime/game-updates-notifier";
import { GameModel } from "..";

import { EventID, EventKind } from "../events-handler";

import { Enemy } from "./enemies/enemy";
import { Drone } from "./enemies/drone";
import { Player } from "./player";
import { Projectile } from "./projectile";

import { LANES, PLAYER_COLORS, VIRTUAL_WIDTH } from "./variables";
import { DRONE_HEIGHT, DRONE_WIDTH } from "./enemies/enemies-stats";
import { Papa } from "./enemies/papa";

import { Difficulty } from "./difficulty";



export class GameEngine {
    private score = 0;
    private health = 10;

    public players: Record<UserID, Player> = {};
    public projectiles: Projectile[] = [];
    public enemies: Enemy[] = [];
    private currWaveEventId?: EventID;

    private difficulty: Difficulty;


    constructor(
        private model: GameModel,
        public notifier: GameUpdatesNotifier,
        playersId: UserID[],
    ) {
        this.difficulty = {
            level: 0,
            waveCount: 0,
            harshness: this.model.game.playersId.length,
        };

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
        if (enemy.x < 11) {
            enemy.destroy();
            this.health = Math.max(0, this.health - enemy.maxHealth);
            if(this.health == 0){
                this.model.hasEnded = true;
            }
            this.notifier.onEnemyDespawned(enemy.id);
            this.notifier.onHealthUpdated(this.health);
        }
    }

    private processProjectile(projectile: Projectile): void {
        projectile.update();
        if (projectile.x > VIRTUAL_WIDTH+10) {
            projectile.destroy();
        }
    }

    private detectCollisions(): void {
        for (const projectile of this.projectiles) {
            if (projectile.markedForDeletion) continue;

            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;

                if (this.checkCollision(enemy, projectile)) {
                    this.hit(enemy);
                    projectile.destroy();
                    if(enemy.alive){
                        this.notifier.onEnemyHit(projectile, enemy.id, enemy.health);
                    }
                    else{
                        this.score += enemy.score;
                        this.notifier.onEnemyKilled(projectile, enemy.id);
                        this.notifier.onScoreUpdated(this.score);
                    }
                    return;
                }
            }
        }
    }

    public hit(enemy: Enemy): void {
        enemy.hit();
        if (!enemy.alive) {
            switch (enemy.type) {
                case "hive-crab":
                    this.spawnEnemy(new Drone(enemy.lane.num, enemy.x-(DRONE_WIDTH/2), enemy.y+(DRONE_HEIGHT/2)));
                    this.spawnEnemy(new Drone(enemy.lane.num, enemy.x, enemy.y-(DRONE_HEIGHT/2)));
                    this.spawnEnemy(new Drone(enemy.lane.num, enemy.x+(DRONE_WIDTH/2), enemy.y+(DRONE_HEIGHT/2)));
                    break;
                case "papa":
                    this.notifier.onBossKilled("papa");
                    this.difficulty.level++;
                default:
                    break;
            }
        }
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
        const noCurrentWave = !this.currWaveEventId || !this.model.eventsHandler.aliveEvents[this.currWaveEventId];

        if (noMoreEnemies && noCurrentWave) {
            this.difficulty.waveCount++;

            if (this.difficulty.waveCount !== 0 && this.difficulty.waveCount % 10 === 0) {
                this.currWaveEventId = this.model.eventsHandler.spawnEvent(EventKind.BOSS_WAVE, this.difficulty);
                this.notifier.onBossWave("papa");
            } else {
                this.currWaveEventId = this.model.eventsHandler.spawnEvent(EventKind.WAVE, this.difficulty);
                this.notifier.onNewWave(this.difficulty.waveCount);
            }

            console.log(`Spawning wave ${this.difficulty.waveCount} with difficulty :`);
            console.log(this.difficulty);
        }
    }
}
