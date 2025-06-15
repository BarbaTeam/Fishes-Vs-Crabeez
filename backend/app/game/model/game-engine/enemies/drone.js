"use strict";
exports.Drone = void 0;
const enemies_stats_1 = require("./enemies-stats");
const enemy_1 = require("./enemy");
class Drone extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super("drone", enemies_stats_1.DRONE_HEALTH, enemies_stats_1.DRONE_SPEED, enemies_stats_1.DRONE_DAMAGE, enemies_stats_1.DRONE_SCORE, enemies_stats_1.DRONE_WIDTH, enemies_stats_1.DRONE_HEIGHT, lane, x, y);
    }
}
exports.Drone = Drone;
