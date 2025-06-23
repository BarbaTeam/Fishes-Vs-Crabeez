import { AnsweredQuestion, UserID }  from '../../shared/types';

import { GameModel } from '../model';



export class GameActionsReceiver {
    constructor (
        private model: GameModel,
    ) {}

    public onStartupRequested(): void {
        this.model.startup();
    }

    public onAnswerReceived(playerId: UserID, answer: AnsweredQuestion): void {
        this.model.quizHandler.receiveAnswer(playerId, answer);
    }

    public onLaneChanged(playerId: UserID, direction: "UP"|"DOWN"): void {
        this.model.gameEngine.handleMove(playerId, direction);
    }

    public onPlayerLeaving(playerId: UserID): void {
        // TODO : Handling player leaving
    }
}
