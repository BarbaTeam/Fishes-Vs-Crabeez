"use strict";
exports.Papa = void 0;
const enemies_stats_1 = require("./enemies-stats");
const enemy_1 = require("./enemy");
class Papa extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super("papa", enemies_stats_1.PAPA_HEALTH, enemies_stats_1.PAPA_SPEED, enemies_stats_1.PAPA_DAMAGE, enemies_stats_1.PAPA_SCORE, enemies_stats_1.PAPA_WIDTH, enemies_stats_1.PAPA_HEIGHT, lane, x, y);
    }
}
exports.Papa = Papa;
