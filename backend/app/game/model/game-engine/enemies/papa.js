"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Papa = void 0;
const enemies_stats_1 = require("./enemies-stats");
const enemy_1 = require("./enemy");
const enemy_kind_1 = require("./enemy-kind");
class Papa extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super(enemy_kind_1.EnemyKind.PAPA, enemies_stats_1.PAPA_HEALTH, enemies_stats_1.PAPA_SPEED, enemies_stats_1.PAPA_DAMAGE, enemies_stats_1.PAPA_SCORE, enemies_stats_1.PAPA_WIDTH, enemies_stats_1.PAPA_HEIGHT, lane, x, y);
    }
}
exports.Papa = Papa;

