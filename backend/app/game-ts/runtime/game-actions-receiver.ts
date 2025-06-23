import { AnsweredQuestion, QuestionNotion, UserID }  from '../../shared/types';

import { GameModel } from '../model';



export class GameActionsReceiver {
    constructor (
        private model: GameModel,
    ) {}

    public onStartupRequested(): void {
        this.model.startup();
        for(const [playerId, playerMask] of Object.entries(this.model.quizHandler.playersNotionMask)){
            const notionMask = {...playerMask, [QuestionNotion.ENCRYPTION]: false};
            this.model.quizHandler.sendQuestion(playerId as UserID, notionMask);
        }
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
