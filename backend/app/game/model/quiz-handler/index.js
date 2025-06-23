"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizHandler = void 0;
const types_1 = require("../../../shared/types");
const utils_1 = require("./utils");
class QuizHandler {
    constructor(model, notifier, playersNotionsMask) {
        this.model = model;
        this.notifier = notifier;
        this._playersNotionsMask = playersNotionsMask;
        for (const [playerId, playerMask] of Object.entries(playersNotionsMask)) {
            this.notifier.onNewQuestionForPlayer(playerId, utils_1.QuestionsGenerator.genQuestion(playerMask));
        }
    }
    receiveAnswer(playerId, ans) {
        // TODO : Accumulating answers
        const answeredCorrectly = utils_1.AnswerChecker.checkAnswer(ans);
        console.log(answeredCorrectly);
        const answeredToEncryptedQuestion = ans.notion === types_1.QuestionNotion.ENCRYPTION;
        if (!answeredCorrectly) {
            if (answeredToEncryptedQuestion) {
                // We don't skip encrypted question
                return;
            }
            this.notifier.onNewQuestionForPlayer(playerId, utils_1.QuestionsGenerator.genQuestion(this._playersNotionsMask[playerId]));
            return;
        }
        if (answeredToEncryptedQuestion) {
            // TODO : Asking `GameEngine` to deparalyze the player
            // this.model.gameEngine. ??? (playerId);
            this.notifier.onPlayerDeparalyzed(playerId);
        }
        this.model.gameEngine.handleShoot(playerId);
        this.notifier.onNewQuestionForPlayer(playerId, utils_1.QuestionsGenerator.genQuestion(this._playersNotionsMask[playerId]));
    }
}
exports.QuizHandler = QuizHandler;
