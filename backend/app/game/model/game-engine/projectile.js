"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
class Projectile {
    constructor(player) {
        this.id = `projectile-${Date.now()}`;
        this.player = player;
        this.x = player.x + player.width / 2;
        this.y = player.y + player.height / 2;
        this.width = 2.5;
        this.height = 2.5;
        this.speed = 10;
        this.markedForDeletion = false;
    }
    destroy() {
        this.markedForDeletion = true;
    }
    update() {
        if (this.x > 100)
            this.destroy();
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
