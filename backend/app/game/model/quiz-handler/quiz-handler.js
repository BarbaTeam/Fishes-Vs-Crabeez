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
    }
    get playersNotionMask() {
        return this._playersNotionsMask;
    }
    receiveAnswer(playerId, ans) {
        this.accumulator.accumulate(playerId, ans);
        const answeredCorrectly = utils_1.AnswerChecker.checkAnswer(ans);
        const answeredToEncryptedQuestion = ans.notion === types_1.QuestionNotion.ENCRYPTION;
        if (answeredToEncryptedQuestion) {
            if (!answeredCorrectly) {
                return; // We don't skip encrypted question
            }
            const eventsAffectingPlayer = Object.entries(this.model.eventsHandler.getEventsAffectingPlayer(playerId));
            for (let [id, event] of eventsAffectingPlayer) {
                if (event.kind === events_handler_1.EventKind.PARALYSIS) {
                    this.model.eventsHandler.killEvent(id);
                }
            }
            // Sending another question different than an ecrypted one :
            const notionMask = Object.assign(Object.assign({}, this._playersNotionsMask[playerId]), { [types_1.QuestionNotion.ENCRYPTION]: false });
            this.sendQuestion(playerId, notionMask);
            return;
        }
        if (answeredCorrectly) {
            this.model.gameEngine.handleShoot(playerId);
        }
        this.sendQuestion(playerId);
    }
    sendQuestion(playerId, notionsMask) {
        let question;
        if (notionsMask) {
            question = utils_1.QuestionsGenerator.genQuestion(notionsMask);
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
