"use strict";
exports.GameLogAccumulator = void 0;
class GameLogAccumulator {
    constructor(gameLobby) {
        this.gameLobby = gameLobby;
        this._acc = {};
        const playersId = gameLobby.playersId;
        for (let playerId of playersId) {
            this._acc[playerId] = [];
        }
    }
    accumulate(playerId, ans) {
        this._acc[playerId].push(ans);
    }
    get gamelog() {
        console.log(this.gameLobby.playersId);
        return {
            gameId: this.gameLobby.gameId,
            info: {
                playersId: this.gameLobby.playersId,
                date: new Date(Date.now()),
                // TODO : Compute duration of game
                duration: 6,
                config: {
                    maxDuration: 15,
                    minNbPlayers: 1,
                    maxNbPlayers: 1,
                    monstersSpeedCoeff: 1,
                    monstersSpawnRate: 1,
                    encrypted: false,
                },
            },
            playersAnswers: Object.values(this._acc),
        };
    }
}
exports.GameLogAccumulator = GameLogAccumulator;
