import { IEventsHandler } from '../events-handler.interface';

import { GameEvent } from './game-event';
import { EventKind } from '../event-types';

import { LaneNumber } from '../../game-engine/lane';
import { Enemy } from '../../game-engine/enemies/enemy';
import { Crab } from '../../game-engine/enemies/crab';

import { biasedRandint, randint } from '../../../../shared/utils/random';
import { halfHarmonic } from '../../../../shared/utils/math';



export class WaveEvent extends GameEvent<Enemy> {
    private static readonly MIN_AMOUNT_OF_ENNEMY: number = 1;
    private static readonly MAX_AMOUNT_OF_ENNEMY: number = 15;

    private static readonly MIN_AMOUNT_OF_ENNEMY_TO_SPAWN: number = 1;
    private static readonly MAX_AMOUNT_OF_ENNEMY_TO_SPAWN: number = 5;

    private _waveDifficulty: number;
    private _ennemies: Enemy[] = [];

    constructor(handler: IEventsHandler, difficulty: number) {
        super(handler, EventKind.WAVE);

        this._waveDifficulty = difficulty;
    }

    onEventBirth(): void {
        super.onEventBirth();

        // TODO : Populating `_ennemies` w/ other ennemies than simple `Crab`

        const amountOfEnemies = biasedRandint(
            this._waveDifficulty,
            4.5, // difficulty goes from 1 to 10 thus the midpoint is `4.5`
            WaveEvent.MIN_AMOUNT_OF_ENNEMY,
            WaveEvent.MAX_AMOUNT_OF_ENNEMY+1,
        );

        for (let i=0; i<amountOfEnemies; i++) {
            this._ennemies.push(new Crab(
                randint(1, 4) as LaneNumber,
            ));
        }
    }

    onEventUpdate(): void {
        super.onEventUpdate();

        if (this._ennemies.length === 0) {
            this.die();
            return;
        }

        const amountOfEnemiesToSpawn = biasedRandint(
            halfHarmonic(this._ennemies.length, this._waveDifficulty),
            2.75, // here, halfHarmonic goes from 1 to 6 thus the midpoint is `2.75`
            WaveEvent.MIN_AMOUNT_OF_ENNEMY_TO_SPAWN,
            Math.min(
                this._ennemies.length,
                WaveEvent.MAX_AMOUNT_OF_ENNEMY_TO_SPAWN,
            )+1,
        );

        for (let i=0; i<amountOfEnemiesToSpawn; i++) {
            this.emit(this._ennemies.pop()!);
        }
    }
}
