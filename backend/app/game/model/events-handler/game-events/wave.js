"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveEvent = void 0;
const game_event_1 = require("./game-event");
const event_types_1 = require("../event-types");
const random_1 = require("../../../../shared/utils/random");
const variables_1 = require("../../game-engine/variables");
const variables_2 = require("../../../../game/model/game-engine/variables");
class WaveEvent extends game_event_1.GameEvent {
    constructor(handler, difficulty) {
        super(handler, event_types_1.EventKind.WAVE);
        this._waveDifficulty = difficulty;
    }
    onEventBirth() {
        var _a;
        super.onEventBirth();
        const amount = (0, random_1.biasedRandint)(this._waveDifficulty.waveCount, 4.5, WaveEvent.MIN_AMOUNT_OF_ENNEMY, WaveEvent.MAX_AMOUNT_OF_ENNEMY + 1, 3 * this._waveDifficulty.harshness);
        const enemiesCrate = variables_1.ENEMIES_CRATES_PER_LEVEL[this._waveDifficulty.level];
        const enemies = [];
        for (let i = 0; i < amount; i++) {
            const lane = (0, random_1.randint)(1, WaveEvent.LANES_COUNT + 1);
            const enemy = enemiesCrate.genEnemy(Math.random(), lane);
            enemies.push(enemy);
        }
        const byLane = {};
        for (const e of enemies) {
            const lane = e.lane;
            if (!byLane[lane.num])
                byLane[lane.num] = [];
            byLane[lane.num].push(e);
        }
        for (let lane = 1; lane <= WaveEvent.LANES_COUNT; lane++) {
            const laneEnemies = (_a = byLane[lane]) !== null && _a !== void 0 ? _a : [];
            let nextX = variables_2.VIRTUAL_WIDTH + 10;
            const laneY0 = variables_2.LANES[lane - 1].y;
            for (const enemy of laneEnemies) {
                const xSpacing = (0, random_1.randint)(enemy.width, enemy.width * 4);
                enemy.x = nextX;
                const laneHalfHeight = WaveEvent.LANE_HEIGHT / 2;
                const enemyHalfHeight = enemy.height / 2;
                const minY = laneY0 - laneHalfHeight + enemyHalfHeight;
                const maxY = laneY0 + laneHalfHeight - enemyHalfHeight;
                enemy.y = Math.random() * (maxY - minY) + minY;
                nextX += xSpacing;
            }
        }
        this.emit(enemies);
        this.die();
    }
}
exports.WaveEvent = WaveEvent;
WaveEvent.MIN_AMOUNT_OF_ENNEMY = 1;
WaveEvent.MAX_AMOUNT_OF_ENNEMY = 15;
WaveEvent.LANE_HEIGHT = 11.75;
WaveEvent.LANES_COUNT = 3;
