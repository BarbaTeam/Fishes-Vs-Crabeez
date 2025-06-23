"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogAccumulator = void 0;
const enemy_kind_1 = require("./game-engine/enemies/enemy-kind");
class GameLogAccumulator {
    constructor(gameLobby) {
        this.gameLobby = gameLobby;
        this._ansAcc = {};
        this._killAcc = {};
        this._scoreAcc = 0;
        const playersId = gameLobby.playersId;
        for (let playerId of playersId) {
            this._ansAcc[playerId] = [];
            this._killAcc[playerId] = Object.values(enemy_kind_1.EnemyKind).reduce((acc, k) => {
                acc[k] = 0;
                return acc;
            }, {});
        }
    }
    accumulateAnswer(playerId, ans) {
        this._ansAcc[playerId].push(ans);
    }
    accumulateKill(playerId, enemyKind) {
        this._killAcc[playerId][enemyKind]++;
    }
    accumulateScore(score) {
        this._scoreAcc += score;
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
            score: this._scoreAcc,
            playersAnswers: Object.values(this._ansAcc),
            playersKills: Object.values(this._killAcc),
        };
    }
}
exports.GameLogAccumulator = GameLogAccumulator;

