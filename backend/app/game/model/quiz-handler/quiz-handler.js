"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizHandler = void 0;
const types_1 = require("../../../shared/types");
const events_handler_1 = require("../events-handler");
const utils_1 = require("./utils");
class QuizHandler {
    constructor(model, notifier, playersNotionsMask, accumulator) {
        this.model = model;
        this.notifier = notifier;
        this.accumulator = accumulator;
        this._playersNotionsMask = playersNotionsMask;
        for (const [playerId, playerMask] of Object.entries(playersNotionsMask)) {
            const notionMask = Object.assign(Object.assign({}, playerMask), { [types_1.QuestionNotion.ENCRYPTION]: false });
            this.sendQuestion(playerId, notionMask);
        }
    }
    receiveAnswer(playerId, ans) {
        this.accumulator.accumulate(playerId, ans);
        const answeredCorrectly = utils_1.AnswerChecker.checkAnswer(ans);
        const answeredToEncryptedQuestion = ans.notion === types_1.QuestionNotion.ENCRYPTION;
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
                if (event.kind === events_handler_1.EventKind.PARALYSIS
                    && event.affectedPlayerId === playerId) {
                    console.log(`Killing event ${id} for player ${playerId}`);
                    this.model.eventsHandler.killEvent(id);
                }
            }
            this.sendQuestion(playerId);
            return;
        }
        this.model.gameEngine.handleShoot(playerId);
        this.sendQuestion(playerId);
    }
    sendQuestion(playerId, notionMask) {
        let question;
        if (notionMask) {
            question = utils_1.QuestionsGenerator.genQuestion(notionMask);
        }
        else {
            question = utils_1.QuestionsGenerator.genQuestion(this._playersNotionsMask[playerId]);
        }
        if (question.notion === types_1.QuestionNotion.ENCRYPTION) {
            this.model.eventsHandler.spawnEvent("PARALYSIS", playerId);
        }
        this.notifier.onNewQuestionForPlayer(playerId, question);
    }
}
exports.QuizHandler = QuizHandler;
