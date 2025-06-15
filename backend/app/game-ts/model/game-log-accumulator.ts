import { AnsweredQuestion, Game, GameLog, UserID } from '../../shared/types';



export class GameLogAccumulator {
    private _acc: Record<UserID, AnsweredQuestion[]> = {} as Record<UserID, AnsweredQuestion[]>;

    constructor(
        private readonly gameLobby: Game,
    ) {
        const playersId = gameLobby.playersId;
        for (let playerId of playersId) {
            this._acc[playerId] = [];
        }
    }

    public accumulate(playerId: UserID, ans: AnsweredQuestion): void {
        this._acc[playerId]!.push(ans);
    }

    public get gamelog(): GameLog {
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
        } as GameLog;
    }
}
