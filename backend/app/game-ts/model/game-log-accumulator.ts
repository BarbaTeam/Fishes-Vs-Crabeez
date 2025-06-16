import { AnsweredQuestion, Game, GameLog, UserID } from '../../shared/types';
import { EnemyKind } from './game-engine/enemies/enemy-kind';



export class GameLogAccumulator {
    private _ansAcc: Record<UserID, AnsweredQuestion[]> = {};
    private _killAcc : Record<UserID, Record<EnemyKind, number>> = {};
    private _scoreAcc : number = 0;

    private _initialPlayersId: UserID[] = [];

    constructor(
        private readonly gameLobby: Game,
    ) {
        const playersId = gameLobby.playersId;
        for (let playerId of playersId) {
            this._ansAcc[playerId] = [];
            this._killAcc[playerId] = Object.values(EnemyKind).reduce((acc, k) => {
                acc[k] = 0;
                return acc;
            }, {} as Record<EnemyKind, number>);
        }
        this._initialPlayersId = [...playersId];
    }

    public accumulateAnswer(playerId: UserID, ans: AnsweredQuestion): void {
        this._ansAcc[playerId]!.push(ans);
    }

    public accumulateKill(playerId: UserID, enemyKind: EnemyKind): void {
        this._killAcc[playerId][enemyKind]++;
    }

    public accumulateScore(score: number): void {
        this._scoreAcc += score;
    }

    public get gamelog(): GameLog {
        console.log(this.gameLobby.playersId);

        return {
            gameId: this.gameLobby.gameId,
            info: {
                playersId: this._initialPlayersId,
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
        } as GameLog;
    }

    public isEmpty(): boolean {
        return (
            Object.values(this._ansAcc).every(playersAnswers => playersAnswers.length === 0)
        );
    }
}
