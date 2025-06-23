"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogAccumulator = void 0;
class GameLogAccumulator {
    constructor(playersId) {
        this._acc = {};
        for (let playerId of playersId) {
            this._acc[playerId] = [];
        }
    }
    accumulate(playerId, ans) {
        this._acc[playerId].push(ans);
    }
    get gamelog() {
        // TODO : ...
        throw new Error("To implement");
    }
}
exports.GameLogAccumulator = GameLogAccumulator;
