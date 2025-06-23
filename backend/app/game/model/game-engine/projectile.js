"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projectile = void 0;
const variables_1 = require("./variables");
class Projectile {
    constructor(player) {
        this.id = `projectile-${Date.now()}`;
        this.player = player;
        this.x = player.x;
        this.y = player.y;
        this.width = 2.5;
        this.height = 2.5;
        this.speed = 10;
        this.markedForDeletion = false;
    }
    destroy() {
        this.markedForDeletion = true;
    }
    update() {
        if (this.x > variables_1.VIRTUAL_WIDTH)
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
