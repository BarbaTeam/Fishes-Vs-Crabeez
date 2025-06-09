"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
class Projectile {
    constructor(player) {
        this.id = `projectile-${Date.now()}`;
        this.player = player;
        this.x = player.x;
        this.y = player.y;
        this.width = 5;
        this.height = 5;
        this.speed = 5;
        this.markedForDeletion = false;
    }
    destroy() {
        this.markedForDeletion = true;
    }
    update() {
        this.x += this.speed;
    }
    toJSON() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            speed: this.speed,
        };
    }
}
exports.Projectile = Projectile;
