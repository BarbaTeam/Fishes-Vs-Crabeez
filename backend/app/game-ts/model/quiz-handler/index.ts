import { GameModel } from '..';
import { AnsweredQuestion, QuestionNotion, User, UserID, UserQuestionNotionsMask } from '../../../shared/types';

import { GameUpdatesNotifier } from '../../runtime/game-updates-notifier'

import { AnswerChecker, QuestionsGenerator } from './utils';



export class QuizHandler {
    private _playersNotionsMask: Record<UserID, UserQuestionNotionsMask>;

    constructor(
        private model: GameModel,
        private notifier: GameUpdatesNotifier,
        playersNotionsMask: Record<UserID, UserQuestionNotionsMask>,
    ) {
        this._playersNotionsMask = playersNotionsMask;
        for(const [playerId, playerMask] of Object.entries(playersNotionsMask)){
            this.notifier.onNewQuestionForPlayer(playerId as UserID, QuestionsGenerator.genQuestion(playerMask));
        }
    }

    public receiveAnswer(playerId: UserID, ans: AnsweredQuestion): void {
        // TODO : Accumulating answers

        const answeredCorrectly = AnswerChecker.checkAnswer(ans);
        const answeredToEncryptedQuestion = ans.notion === QuestionNotion.ENCRYPTION;

        if (!answeredCorrectly) {
            if (answeredToEncryptedQuestion) {
                // We don't skip encrypted question
                return;
            }

            this.model.gameEngine.handleShoot(playerId);
            this.notifier.onNewQuestionForPlayer(
                playerId,
                QuestionsGenerator.genQuestion(this._playersNotionsMask[playerId]),
            );
            return;
        }

        if (answeredToEncryptedQuestion) {
            // TODO : Asking `GameEngine` to deparalyze the player
            // this.model.gameEngine. ??? (playerId);
            this.notifier.onPlayerDeparalyzed(playerId);
        }
    }
}
