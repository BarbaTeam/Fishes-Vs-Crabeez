"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveEvent = void 0;
const game_event_1 = require("./game-event");
const event_types_1 = require("../event-types");
const crab_1 = require("../../game-engine/enemies/crab");
const random_1 = require("../../../../shared/utils/random");
const math_1 = require("../../../../shared/utils/math");
class WaveEvent extends game_event_1.GameEvent {
    constructor(handler, difficulty) {
        super(handler, event_types_1.EventKind.WAVE);
        this._ennemies = [];
        this._waveDifficulty = difficulty;
    }
    onEventBirth() {
        super.onEventBirth();
        // TODO : Populating `_ennemies` w/ other ennemies than simple `Crab`
        const amountOfEnemies = (0, random_1.biasedRandint)(this._waveDifficulty, 4.5, // difficulty goes from 1 to 10 thus the midpoint is `4.5`
        WaveEvent.MIN_AMOUNT_OF_ENNEMY, WaveEvent.MAX_AMOUNT_OF_ENNEMY + 1);
        for (let i = 0; i < amountOfEnemies; i++) {
            this._ennemies.push(new crab_1.Crab((0, random_1.randint)(1, 4)));
        }
    }
    onEventUpdate() {
        super.onEventUpdate();
        if (this._ennemies.length === 0) {
            this.die();
            return;
        }
        const amountOfEnemiesToSpawn = (0, random_1.biasedRandint)((0, math_1.halfHarmonic)(this._ennemies.length, this._waveDifficulty), 2.75, // here, halfHarmonic goes from 1 to 6 thus the midpoint is `2.75`
        WaveEvent.MIN_AMOUNT_OF_ENNEMY_TO_SPAWN, Math.min(this._ennemies.length, WaveEvent.MAX_AMOUNT_OF_ENNEMY_TO_SPAWN) + 1);
        for (let i = 0; i < amountOfEnemiesToSpawn; i++) {
            this.emit(this._ennemies.pop());
        }
    }
}
exports.WaveEvent = WaveEvent;
WaveEvent.MIN_AMOUNT_OF_ENNEMY = 1;
WaveEvent.MAX_AMOUNT_OF_ENNEMY = 15;
WaveEvent.MIN_AMOUNT_OF_ENNEMY_TO_SPAWN = 1;
WaveEvent.MAX_AMOUNT_OF_ENNEMY_TO_SPAWN = 5;
