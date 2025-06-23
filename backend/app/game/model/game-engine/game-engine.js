"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEngine = void 0;
const events_handler_1 = require("../events-handler");
const drone_1 = require("./enemies/drone");
const player_1 = require("./player");
const projectile_1 = require("./projectile");
const variables_1 = require("./variables");
const enemies_stats_1 = require("./enemies/enemies-stats");
const papa_1 = require("./enemies/papa");
class GameEngine {
    constructor(model, notifier, playersId) {
        this.model = model;
        this.notifier = notifier;
        this.players = {};
        this.projectiles = [];
        this.enemies = [];
        this.score = 0;
        this.health = 10;
        this.difficulty = {
            level: 0,
            waveCount: 0,
            harshness: this.model.game.playersId.length,
        };
        for (const [i, playerId] of playersId.entries()) {
            this.registerPlayer(playerId, variables_1.PLAYER_COLORS[i], i);
        }
    }
    registerPlayer(playerId, color, laneIndex) {
        const player = new player_1.Player(playerId, color, variables_1.LANES[laneIndex]);
        this.players[playerId] = player;
    }
    handleMove(playerId, direction) {
        const player = this.players[playerId];
        if (!player)
            return;
        if (direction === 'UP')
            player.moveUp();
        else if (direction === 'DOWN')
            player.moveDown();
        this.notifier.onPlayerChangedLane(playerId, player.lane.num, player.x, player.y);
        this.notifyAllLanes();
    }
    notifyAllLanes() {
        for (const lane of variables_1.LANES) {
            for (const player of lane.getPlayers()) {
                this.notifier.onPlayerChangedPosition(player.id, player.x, player.y);
            }
        }
    }
    handleShoot(playerId) {
        const player = this.players[playerId];
        if (!player)
            return;
        const projectile = new projectile_1.Projectile(player);
        this.projectiles.push(projectile);
        this.notifier.onPlayerShot(playerId, projectile);
    }
    spawnEnemy(enemy) {
        this.enemies.push(enemy);
        this.notifier.onEnemyAdded(enemy);
    }
    paralysePlayer(playerId) {
        const player = this.players[playerId];
        if (!player)
            return;
        player.isParalysed = true;
        this.notifier.onPlayerParalysed(playerId);
    }
    deparalysePlayer(playerId) {
        const player = this.players[playerId];
        if (!player)
            return;
        player.isParalysed = false;
        this.notifier.onPlayerDeparalysed(playerId);
    }
    checkCollision(obj1, obj2) {
        return !(obj1.x + obj1.width / 2 < obj2.x - obj2.width / 2 ||
            obj1.x - obj1.width / 2 > obj2.x + obj2.width / 2 ||
            obj1.y + obj1.height / 2 < obj2.y - obj2.height / 2 ||
            obj1.y - obj1.height / 2 > obj2.y + obj2.height / 2);
    }
    processEnemy(enemy) {
        enemy.update();
        if (enemy.x < 11) {
            enemy.destroy();
            this.health = Math.max(0, this.health - enemy.maxHealth);
            if (this.health <= 1) {
                this.model.hasEnded = true;
            }
            this.notifier.onEnemyDespawned(enemy.id);
            this.notifier.onHealthUpdated(this.health);
        }
    }
    processProjectile(projectile) {
        projectile.update();
        if (projectile.x > variables_1.VIRTUAL_WIDTH + 10) {
            projectile.destroy();
        }
    }
    detectCollisions() {
        for (const projectile of this.projectiles) {
            if (projectile.markedForDeletion)
                continue;
            for (const enemy of this.enemies) {
                if (!enemy.alive)
                    continue;
                if (this.checkCollision(enemy, projectile)) {
                    this.hit(enemy);
                    projectile.destroy();
                    if (enemy.alive) {
                        this.notifier.onEnemyHit(projectile, enemy.id, enemy.health);
                    }
                    else {
                        this.score += enemy.score;
                        this.notifier.onEnemyKilled(projectile, enemy.id);
                        this.notifier.onScoreUpdated(this.score);
                    }
                    return;
                }
            }
        }
    }
    hit(enemy) {
        enemy.hit();
        if (!enemy.alive) {
            switch (enemy.type) {
                case "hive-crab":
                    this.spawnEnemy(new drone_1.Drone(enemy.lane.num, enemy.x - (enemies_stats_1.DRONE_WIDTH / 2), enemy.y + (enemies_stats_1.DRONE_HEIGHT / 2)));
                    this.spawnEnemy(new drone_1.Drone(enemy.lane.num, enemy.x, enemy.y - (enemies_stats_1.DRONE_HEIGHT / 2)));
                    this.spawnEnemy(new drone_1.Drone(enemy.lane.num, enemy.x + (enemies_stats_1.DRONE_WIDTH / 2), enemy.y + (enemies_stats_1.DRONE_HEIGHT / 2)));
                    break;
                case "papa":
                    this.notifier.onBossKilled("papa");
                default:
                    break;
            }
        }
    }
    getAllPlayers() {
        return Object.values(this.players).map(player => player.toJSON());
    }
    update() {
        if (!this.boss) {
            this.notifier.onBossWave("papa");
            this.spawnEnemy(new papa_1.Papa(2));
            this.boss = true;
        }
        this.spawnNextWaveIfNeeded();
        this.enemies.forEach(enemy => this.processEnemy(enemy));
        this.projectiles.forEach(projectile => this.processProjectile(projectile));
        this.detectCollisions();
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => e.alive);
    }
    spawnNextWaveIfNeeded() {
        const noMoreEnemies = this.enemies.length === 0;
        const noCurrentWave = !this.currWaveEventId || !this.model.eventsHandler.aliveEvents[this.currWaveEventId];
        if (noMoreEnemies && noCurrentWave) {
            this.currWaveEventId = this.model.eventsHandler.spawnEvent(events_handler_1.EventKind.WAVE, this.difficulty);
            this.difficulty.waveCount++;
            this.notifier.onNewWave(this.difficulty.waveCount++);
            console.log(`Spawning wave ${this.difficulty.waveCount++} with difficulty :`);
            console.log(this.difficulty);
        }
    }
}
exports.GameEngine = GameEngine;
