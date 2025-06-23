import { AnsweredQuestion, UserID }  from '../../shared/types';

import { GameModel } from '../model';



export class GameActionsReceiver {
    constructor (
        private model: GameModel,
    ) {}

    public onAnswerReceived(playerId: UserID, answer: AnsweredQuestion): void {
        // TODO : ...
    }

    public onLanesChange(playerId: UserID, change: "UP"|"DOWN"): void {
        // TODO : ...
    }

    public onPlayerLeaving(playerId: UserID): void {
        // TODO : ...
    }
}
