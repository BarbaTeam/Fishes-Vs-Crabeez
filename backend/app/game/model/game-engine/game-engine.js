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
        for (const [i, playerId] of playersId.entries()) {
            this.registerPlayer(playerId, variables_1.PLAYER_COLORS[i], i);
        }
    }
    registerPlayer(playerId, color, num_lane) {
        const player = new player_1.Player(playerId, color, variables_1.LANES[num_lane]);
        player.id = playerId;
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
        console.log(`[MOVE] ${playerId} moved to lane ${player.lane.num}`);
        this.notifier.onPlayerChangedLane(playerId, player.lane.num, player.x, player.y);
        this.notifyAllLanes();
    }
    notifyAllLanes() {
        for (const lane of variables_1.LANES) {
            const players = lane.getPlayers();
            for (const player of players) {
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
        this.players[playerId].isParalysed = true;
        this.notifier.onPlayerParalysed(playerId);
    }
    deparalysePlayer(playerId) {
        this.players[playerId].isParalysed = false;
        this.notifier.onPlayerDeparalysed(playerId);
    }
    _checkCollision(obj1, obj2) {
        if (!obj1 || !obj2)
            return false;
        if (typeof obj1.x !== 'number' || typeof obj1.y !== 'number')
            return false;
        if (typeof obj2.x !== 'number' || typeof obj2.y !== 'number')
            return false;
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.width / 2 + obj2.width / 2);
    }
    kill(enemy) {
        enemy.destroy();
        const ennemyIdx = this.enemies.indexOf(enemy);
        if (ennemyIdx === -1)
            return; // Shouldn't happen
        this.enemies.splice(ennemyIdx, 1);
    }
    getAllPlayers() {
        return Object.values(this.players).map(player => player.toJSON());
    }
    update() {
        if (this.enemies.length === 0
            && (this.currWaveEventId === undefined
                || !this.model.eventsHandler.aliveEvents[this.currWaveEventId])) {
            // TODO : Using dynamic difficulty
            console.log("Spawning new wave event");
            const PLACEHOLDER_DIFFICULTY = 10;
            this.model.eventsHandler.spawnEvent(events_handler_1.EventKind.WAVE, PLACEHOLDER_DIFFICULTY);
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
exports.GameEngine = GameEngine;
