"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEngine = void 0;
const events_handler_1 = require("../events-handler");
const player_1 = require("./player");
const projectile_1 = require("./projectile");
const variables_1 = require("./variables");
class GameEngine {
    constructor(model, notifier, playersId) {
        this.model = model;
        this.notifier = notifier;
        this.players = {};
        this.projectiles = [];
        this.enemies = [];
        this.score = 0;
        this.health = 10;
        this.waveCounter = 0;
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
            this.kill(enemy);
            if (this.health == 1) {
                this.model.hasEnded = true;
            }
            this.health--;
            this.notifier.onEnemyDespawned(enemy.id);
            this.notifier.onHealthUpdated(this.health);
        }
    }
    processProjectile(projectile) {
        projectile.update();
        if (projectile.x > variables_1.VIRTUAL_WIDTH) {
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
    kill(enemy) {
        enemy.destroy();
    }
    getAllPlayers() {
        return Object.values(this.players).map(player => player.toJSON());
    }
    update() {
        this.spawnNextWaveIfNeeded();
        this.enemies.forEach(enemy => this.processEnemy(enemy));
        this.projectiles.forEach(projectile => this.processProjectile(projectile));
        this.detectCollisions();
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => e.alive);
    }
    spawnNextWaveIfNeeded() {
        const noMoreEnemies = this.enemies.length === 0;
        const currentEventEnded = !this.currWaveEventId || !this.model.eventsHandler.aliveEvents[this.currWaveEventId];
        if (noMoreEnemies && currentEventEnded) {
            const PLACEHOLDER_DIFFICULTY = 10;
            this.currWaveEventId = this.model.eventsHandler.spawnEvent(events_handler_1.EventKind.WAVE, PLACEHOLDER_DIFFICULTY);
            this.waveCounter++;
            this.notifier.onNewWave(this.waveCounter);
        }
    }
}
exports.GameEngine = GameEngine;

