import { AnsweredQuestion, UserID } from "../../shared/types";



export class GameLogAccumulator {
    private _acc: Record<UserID, AnsweredQuestion[]> = {} as Record<UserID, AnsweredQuestion[]>;

    constructor(playersId: UserID[]) {
        for (let playerId of playersId) {
            this._acc[playerId] = [];
        }
    }

    public accumulate(playerId: UserID, ans: AnsweredQuestion): void {
        this._acc[playerId]!.push(ans);
    }

    public get gamelog(): any {
        // TODO : ...
        throw new Error("To implement");
    }
}
