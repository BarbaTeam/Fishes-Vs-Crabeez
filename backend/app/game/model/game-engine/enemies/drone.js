"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drone = void 0;
const enemies_stats_1 = require("./enemies-stats");
const enemy_1 = require("./enemy");
const enemy_kind_1 = require("./enemy-kind");
class Drone extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super(enemy_kind_1.EnemyKind.DRONE, enemies_stats_1.DRONE_HEALTH, enemies_stats_1.DRONE_SPEED, enemies_stats_1.DRONE_DAMAGE, enemies_stats_1.DRONE_SCORE, enemies_stats_1.DRONE_WIDTH, enemies_stats_1.DRONE_HEIGHT, lane, x, y);
    }
}
exports.Drone = Drone;

