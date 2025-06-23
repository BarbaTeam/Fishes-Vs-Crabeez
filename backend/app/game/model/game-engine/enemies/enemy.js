"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
const random_1 = require("../../../../shared/utils/random");
const variables_1 = require("../variables");
class Enemy {
    constructor(type, health, speed, score, width, height, laneNum, x, y) {
        this.type = type;
        this.health = health;
        this.speed = speed;
        this.score = score;
        this.width = width;
        this.height = height;
        this.id = `ennemy-${Date.now()}`;
        this.lane = variables_1.LANES[laneNum !== undefined
            ? laneNum - 1
            : (0, random_1.randint)(0, 3)];
        this.x = this._computeInitialXPosition(x);
        this.y = this._computeInitialYPosition(y);
        this.width = width;
        this.height = height;
        this.health = health;
        this.speed = speed;
        this.alive = true;
        this.score = score;
    }
    _computeInitialXPosition(providedX) {
        if (providedX !== undefined) {
            return providedX;
        }
        return 100 + this.width;
    }
    _computeInitialYPosition(providedY) {
        if (providedY !== undefined) {
            return providedY;
        }
        switch (this.lane.num) {
            case 1:
                return variables_1.bandHeight * 3.5;
            case 2:
                return variables_1.bandHeight * 2.5;
            case 3:
                return variables_1.bandHeight * 1.5;
            default:
                return variables_1.bandHeight * 1.5;
        }
    }
    destroy() {
        this.alive = false;
    }
    update() {
        this.x -= this.speed;
    }
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            speed: this.speed,
        };
    }
}
exports.Enemy = Enemy;
