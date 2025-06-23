import { GameUpdatesNotifier } from '../../runtime/game-updates-notifier'

import { AnswerChecker, QuestionsGenerator } from './utils';



export class QuizHandler {
    constructor(
        private notifier: GameUpdatesNotifier
    ) {}
}
