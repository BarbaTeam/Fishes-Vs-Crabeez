import { IEventsHandler } from '../events-handler.interface';

import { GameEvent } from './game-event';
import { EventKind } from '../event-types';

import { LaneNumber } from '../../game-engine/lane';
import { Enemy } from '../../game-engine/enemies/enemy';
import { Crab } from '../../game-engine/enemies/crab';

import { biasedRandint, randint } from '../../../../shared/utils/random';
import { LANES, VIRTUAL_WIDTH } from '../../../../game/model/game-engine/variables';
import { HiveCrab } from '../../../../game/model/game-engine/enemies/hive-crab';



export class WaveEvent extends GameEvent<any[]> {
    private static readonly MIN_AMOUNT_OF_ENNEMY: number = 1;
    private static readonly MAX_AMOUNT_OF_ENNEMY: number = 15;

    private static readonly LANE_HEIGHT: number = 11.75;
    private static readonly LANES_COUNT: number = 3;


    private _waveDifficulty: number;


    constructor(handler: IEventsHandler, difficulty: number) {
        super(handler, EventKind.WAVE);
        this._waveDifficulty = difficulty;
    }


    onEventBirth(): void {
        super.onEventBirth();

        const enemies: any[] = [];
        const amount = biasedRandint(
            this._waveDifficulty,
            4.5,
            WaveEvent.MIN_AMOUNT_OF_ENNEMY,
            WaveEvent.MAX_AMOUNT_OF_ENNEMY + 1,
        );

        for (let i = 0; i < amount; i++) {
            const lane = randint(1, WaveEvent.LANES_COUNT + 1) as LaneNumber;
            const enemy = Math.random() > 0.3 ? new Crab(lane) : new HiveCrab(lane);
            enemies.push(enemy);
        }

        const byLane: Record<number, any[]> = {};
        for (const e of enemies) {
            const lane = e.lane;
            if (!byLane[lane.num-1]) byLane[lane.num-1] = [];
            byLane[lane.num-1].push(e);
        }

        for (let lane = 1; lane <= WaveEvent.LANES_COUNT; lane++) {
            const laneEnemies = byLane[lane] ?? [];
            let nextX = VIRTUAL_WIDTH + 10;
            const laneY0 = LANES[lane - 1].y;

            for (const enemy of laneEnemies) {
                const xSpacing = randint(enemy.width, enemy.width*4);

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
    }
}