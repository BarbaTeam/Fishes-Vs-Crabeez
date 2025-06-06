const Crab = require('./enemy/crab');
const Player = require('./player');
const Projectile = require('./projectile');

class GameEngine {
    constructor(sender) {
        this.sender = sender;
        this.players = {};
        this.projectiles = [];
        this.enemies = [];
        this.init();
    }

    init() {
        setInterval(() => this.update(), 1000 / 30);
    }

    registerPlayer(playerId, lane = 1) {
        const player = new Player(lane);
        this.players[playerId] = player;
        this.sender.playerJoined(player);
    }

    handleMove(playerId, direction) {
        const player = this.players[playerId];
        if (!player) return;

        if (direction === 'UP') player.moveUp();
        else if (direction === 'DOWN') player.moveDown();

        this.sender.playerMoved(playerId, player.lane);
    }

    handleShoot(playerId) {
        const player = this.players[playerId];
        if (!player) return;

        const projectile = new Projectile(player);
        this.projectiles.push(projectile);

        this.sender.playerShot(projectile);
    }

    _checkCollision(obj1, obj2) {
        if (!obj1 || !obj2) return false;
        if (typeof obj1.x !== 'number' || typeof obj1.y !== 'number') return false;
        if (typeof obj2.x !== 'number' || typeof obj2.y !== 'number') return false;

        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (obj1.width / 2 + obj2.width / 2);
    }

    _addEnemy() {
        const enemy = new Crab(1000);
        this.enemies.push(enemy);
        return enemy;
    }

    kill(enemy) {
        enemy.destroy();
    }

    update() {
        this.enemies.forEach(enemy => {
            enemy.update();

            this.projectiles.forEach(projectile => {
                if (!projectile.markedForDeletion && this._checkCollision(enemy, projectile)) {
                    const player = projectile.player;
                    this.kill(enemy);
                    projectile.destroy();
                    player.score += enemy.score;

                    this.sender.playerScored(projectile, enemy, player.score);
                }
            });
        });

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemies = this.enemies.filter(e => e.alive);

        if (this.enemies.length < 3) {
            const enemy = this._addEnemy();
            this.sender.enemyAdded(enemy);
        }
    }
}

module.exports = GameEngine;
