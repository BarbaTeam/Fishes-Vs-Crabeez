import { AnsweredQuestion, Question, QuestionNotion, UserID, UserQuestionNotionsMask } from '../../../shared/types';

import { GameModel } from '..';
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
    }

    public get playersNotionMask() : Record<UserID, UserQuestionNotionsMask> {
        return this._playersNotionsMask;
    }

    public receiveAnswer(playerId: UserID, ans: AnsweredQuestion): void {
        this.accumulator.accumulateAnswer(playerId, ans);

        const answeredCorrectly = AnswerChecker.checkAnswer(ans);
        const answeredToEncryptedQuestion = ans.notion === QuestionNotion.ENCRYPTION;

        if (answeredToEncryptedQuestion) {
            if (!answeredCorrectly) {
                return; // We don't skip encrypted question
            }

            const eventsAffectingPlayer = Object.entries(
                this.model.eventsHandler.getEventsAffectingPlayer(playerId)
            );
            for (let [id, event] of eventsAffectingPlayer) {
                if (event.kind === EventKind.PARALYSIS) {
                    this.model.eventsHandler.killEvent(id as EventID);
                }
            }

            // Sending another question different than an ecrypted one :
            const notionMask = {...this._playersNotionsMask[playerId], [QuestionNotion.ENCRYPTION]: false};
            this.sendQuestion(playerId, notionMask);
            return;
        }

        if (answeredCorrectly) {
            this.model.gameEngine.handleShoot(playerId);
        }
        this.sendQuestion(playerId);
    }

    public sendQuestion(playerId: UserID, notionsMask?: UserQuestionNotionsMask): void {
        let question: Question;

        if (notionsMask) {
            question = QuestionsGenerator.genQuestion(notionsMask);
        } else {
            question = QuestionsGenerator.genQuestion(this._playersNotionsMask[playerId]);
        }

        if( question.notion === QuestionNotion.ENCRYPTION ) {
            this.model.eventsHandler.spawnEvent("PARALYSIS", playerId);
        }
        this.notifier.onNewQuestionForPlayer(playerId, question);
    }
}
