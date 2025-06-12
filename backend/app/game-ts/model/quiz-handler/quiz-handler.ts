import { GameModel } from '..';
import { AnsweredQuestion, QuestionNotion, UserID, UserQuestionNotionsMask } from '../../../shared/types';

import { GameLogAccumulator } from '../game-log-accumulator';
import { GameUpdatesNotifier } from '../../runtime/game-updates-notifier'

import { EventID, EventKind } from '../events-handler';

import { AnswerChecker, QuestionsGenerator } from './utils';
import { IQuizHandler } from './quiz-handler.interface';



export class QuizHandler implements IQuizHandler {
    private _playersNotionsMask: Record<UserID, UserQuestionNotionsMask>;

    constructor(
        private model: GameModel,
        private notifier: GameUpdatesNotifier,
        playersNotionsMask: Record<UserID, UserQuestionNotionsMask>,
        private accumulator: GameLogAccumulator,
    ) {
        this._playersNotionsMask = playersNotionsMask;
        for(const [playerId, playerMask] of Object.entries(playersNotionsMask)){
            const notionMask = {...playerMask, [QuestionNotion.ENCRYPTION]: false};
            this.sendQuestion(playerId as UserID, notionMask);
        }
    }

    public receiveAnswer(playerId: UserID, ans: AnsweredQuestion): void {
        this.accumulator.accumulate(playerId, ans);

        const answeredCorrectly = AnswerChecker.checkAnswer(ans);
        const answeredToEncryptedQuestion = ans.notion === QuestionNotion.ENCRYPTION;

        if (!answeredCorrectly) {
            if (answeredToEncryptedQuestion) {
                // We don't skip encrypted question
                return;
            }
            this.sendQuestion(playerId);
            return;
        }

        if (answeredToEncryptedQuestion) {
            for (let [id, event] of Object.entries(this.model.eventsHandler.aliveEvents)) {
                if (
                    event.kind === EventKind.PARALYSIS
                    && event.affectedPlayerId === playerId
                ) {
                    console.log(`Killing event ${id} for player ${playerId}`);
                    this.model.eventsHandler.killEvent(id as EventID);
                }
            }

            this.sendQuestion(playerId);
            return;
        }
        this.model.gameEngine.handleShoot(playerId);
        this.sendQuestion(playerId);
    }

    public sendQuestion(playerId: UserID, notionMask?: UserQuestionNotionsMask): void {
        let question;
        if (notionMask) {
            question = QuestionsGenerator.genQuestion(notionMask);
        } else {
            question = QuestionsGenerator.genQuestion(this._playersNotionsMask[playerId]);
        }
        if( question.notion === QuestionNotion.ENCRYPTION ) {
            this.model.eventsHandler.spawnEvent("PARALYSIS", playerId);
        }
        this.notifier.onNewQuestionForPlayer(
                playerId,
                question,
        );
    }
}
