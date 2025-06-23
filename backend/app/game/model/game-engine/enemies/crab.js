"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crab = void 0;
const enemy_1 = require("./enemy");
class Crab extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super(Crab.CRAB_HEALTH, lane, x, y);
    }
    toJSON() {
        return super.toJSON();
    }
}
exports.Crab = Crab;
Crab.CRAB_HEALTH = 1;
