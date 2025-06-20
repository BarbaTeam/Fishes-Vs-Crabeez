"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crab = void 0;
const enemies_stats_1 = require("./enemies-stats");
const enemy_1 = require("./enemy");
const enemy_kind_1 = require("./enemy-kind");
class Crab extends enemy_1.Enemy {
    constructor(lane, x, y) {
        super(enemy_kind_1.EnemyKind.CRAB, enemies_stats_1.CRAB_HEALTH, enemies_stats_1.CRAB_SPEED, enemies_stats_1.CRAB_DAMAGE, enemies_stats_1.CRAB_SCORE, enemies_stats_1.CRAB_WIDTH, enemies_stats_1.CRAB_HEIGHT, lane, x, y);
    }
}
exports.Crab = Crab;

