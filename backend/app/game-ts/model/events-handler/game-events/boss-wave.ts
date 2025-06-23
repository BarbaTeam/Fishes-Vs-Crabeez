import { IEventsHandler } from '../events-handler.interface';

import { GameEvent } from './game-event';
import { EventKind } from '../event-types';

import { LaneNumber } from '../../game-engine/lane';
import { Enemy } from '../../game-engine/enemies/enemy';
import { Papa } from '../../game-engine/enemies/papa';

import { biasedRandint, randint } from '../../../../shared/utils/random';
import { Difficulty } from '../../game-engine/difficulty';
import { ENEMIES_CRATES_PER_LEVEL } from '../../game-engine/variables';

import { LANES, VIRTUAL_WIDTH } from '../../../../game/model/game-engine/variables';



export class BossWaveEvent extends GameEvent<any[]> {
    private static readonly MIN_AMOUNT_OF_ENNEMY: number = 1;
    private static readonly MAX_AMOUNT_OF_ENNEMY: number = 15;

    private static readonly LANE_HEIGHT: number = 11.75;
    private static readonly LANES_COUNT: number = 3;


    private _waveDifficulty: Difficulty;


    constructor(
        handler: IEventsHandler, difficulty: Difficulty,
    ) {
        super(handler, EventKind.WAVE);
        this._waveDifficulty = difficulty;
    }

    onEventBirth(): void {
        super.onEventBirth();

        const amount = biasedRandint(
            this._waveDifficulty.waveCount,
            4.5,
            BossWaveEvent.MIN_AMOUNT_OF_ENNEMY,
            BossWaveEvent.MAX_AMOUNT_OF_ENNEMY + 1,
            1 + this._waveDifficulty.harshness,
        );

        const papa = new Papa(2);
        const enemiesCrate = ENEMIES_CRATES_PER_LEVEL[this._waveDifficulty.level];

        const enemies: Enemy[] = [];
        for (let i = 0; i < amount; i++) {
            const lane = randint(1, BossWaveEvent.LANES_COUNT + 1) as LaneNumber;
            const enemy = enemiesCrate.genEnemy(Math.random(), lane);
            enemies.push(enemy);
        }

        const byLane: Record<number, any[]> = {};
        for (const e of enemies) {
            const lane = e.lane;
            if (!byLane[lane.num]) byLane[lane.num] = [];
            byLane[lane.num].push(e);
        }

        for (let lane = 1; lane <= BossWaveEvent.LANES_COUNT; lane++) {
            const laneEnemies = byLane[lane] ?? [];
            let nextX = VIRTUAL_WIDTH + 10;
            const laneY0 = LANES[lane-1].y;

            for (const enemy of laneEnemies) {
                const xSpacing = randint(enemy.width, enemy.width*4);

                enemy.x = nextX;

                const laneHalfHeight = BossWaveEvent.LANE_HEIGHT / 2;
                const enemyHalfHeight = enemy.height / 2;

                const minY = laneY0 - laneHalfHeight + enemyHalfHeight;
                const maxY = laneY0 + laneHalfHeight - enemyHalfHeight;

                enemy.y = Math.random() * (maxY - minY) + minY;

                nextX += xSpacing;
            }
        }

        enemies.push(papa);

        this.emit(enemies);
        this.die();
    }
}