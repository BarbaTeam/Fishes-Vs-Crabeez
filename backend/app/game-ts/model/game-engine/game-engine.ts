import { UserID } from "../../../shared/types";

import { GameUpdatesNotifier } from "../../runtime/game-updates-notifier";
import { GameModel } from "..";

import { EventID, EventKind } from "../events-handler";

import { Enemy } from "./enemies/enemy";
import { Player } from "./player";
import { Projectile } from "./projectile";

import { LANES, PLAYER_COLORS } from "./variables";




export class GameEngine {
    public players: Record<UserID, Player> = {};
    public projectiles : Projectile[] = [];
    public enemies : Enemy[] = [];

    constructor(
        private model: GameModel,
        public notifier : GameUpdatesNotifier,
        playersId: UserID[],
    ) {
        for (const [i, playerId] of playersId.entries()) {
            this.registerPlayer(playerId, PLAYER_COLORS[i], i);
        }
    }

    private registerPlayer(playerId : UserID, color: "yellow"|"blue"|"red", num_lane : number): void {
        const player = new Player(playerId, color, LANES[num_lane]);
        player.id = playerId;
        this.players[playerId] = player;
    }

    public handleMove(playerId: UserID, direction: string) {
        const player = this.players[playerId];
        if (!player) return;

        if (direction === 'UP') player.moveUp();
        else if (direction === 'DOWN') player.moveDown();
        console.log(`[MOVE] ${playerId} moved to lane ${player.lane.num}`);

        this.notifier.onPlayerChangedLane(playerId, player.lane.num, player.x, player.y);
        this.notifyAllLanes();
    }

    private notifyAllLanes(): void {
        for (const lane of LANES) {
            const players = lane.getPlayers();
            for (const player of players) {
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
        this.players[playerId].isParalysed = true;
        this.notifier.onPlayerParalysed(playerId);
    }

    public deparalysePlayer(playerId: UserID): void {
        this.players[playerId].isParalysed = false;
        this.notifier.onPlayerDeparalysed(playerId);
    }

    private _checkCollision(obj1 : any, obj2: any) {
        if (!obj1 || !obj2) return false;
        if (typeof obj1.x !== 'number' || typeof obj1.y !== 'number') return false;
        if (typeof obj2.x !== 'number' || typeof obj2.y !== 'number') return false;

        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (obj1.width / 2 + obj2.width / 2);
    }

    public kill(enemy : Enemy): void {
        enemy.destroy();

        const ennemyIdx = this.enemies.indexOf(enemy);
        if (ennemyIdx === -1) return; // Shouldn't happen
        this.enemies.splice(ennemyIdx, 1);
    }

    public getAllPlayers(): Player[] {
        return Object.values(this.players).map(player => player.toJSON());
    }


    private currWaveEventId?: EventID;
    public update() {
        if (
            this.enemies.length === 0
            && (
                this.currWaveEventId === undefined
                || !this.model.eventsHandler.aliveEvents[this.currWaveEventId]
            )
        ) {
            // TODO : Using dynamic difficulty
            console.log("Spawning new wave event");
            const PLACEHOLDER_DIFFICULTY = 10;
            this.model.eventsHandler.spawnEvent(EventKind.WAVE, PLACEHOLDER_DIFFICULTY);
        }

        this.enemies.forEach(enemy => {
            enemy.update();
            if (enemy.x < 10) {
                this.kill(enemy);
                this.notifier.onEnemyDespawned(enemy.id);
            }
            this.projectiles.forEach(projectile => {
                projectile.update();
                if (!projectile.markedForDeletion && this._checkCollision(enemy, projectile)) {
                    const player = projectile.player;
                    this.kill(enemy);
                    projectile.destroy();
                    player.score += enemy.score;

                    this.notifier.onPlayerScoreUpdated(player.id, player.score);
                    this.notifier.onEnemyKilled(projectile, enemy);
                }
            });
        });

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => e.alive);
    }
}
