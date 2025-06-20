"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiveCrab = void 0;
const enemies_stats_1 = require("./enemies-stats");
const enemy_1 = require("./enemy");
const enemy_kind_1 = require("./enemy-kind");
class HiveCrab extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super(enemy_kind_1.EnemyKind.HIVECRAB, enemies_stats_1.HIVECRAB_HEALTH, enemies_stats_1.HIVECRAB_SPEED, enemies_stats_1.HIVECRAB_DAMAGE, enemies_stats_1.HIVECRAB_SCORE, enemies_stats_1.HIVECRAB_WIDTH, enemies_stats_1.HIVECRAB_HEIGHT, lane, x, y);
    }
}
exports.HiveCrab = HiveCrab;

