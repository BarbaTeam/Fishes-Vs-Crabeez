"use strict";
exports.GameActionsReceiver = void 0;
const types_1 = require("../../shared/types");
class GameActionsReceiver {
    constructor(model) {
        this.model = model;
    }
    onStartupRequested() {
        this.model.startup();
        for (const [playerId, playerMask] of Object.entries(this.model.quizHandler.playersNotionMask)) {
            const notionMask = Object.assign(Object.assign({}, playerMask), { [types_1.QuestionNotion.ENCRYPTION]: false });
            this.model.quizHandler.sendQuestion(playerId, notionMask);
        }
    }
    onAnswerReceived(playerId, answer) {
        this.model.quizHandler.receiveAnswer(playerId, answer);
    }
    onLaneChanged(playerId, direction) {
        this.model.gameEngine.handleMove(playerId, direction);
    }
    onPlayerLeaving(playerId) {
        // TODO : Handling player leaving
    }
}
exports.GameActionsReceiver = GameActionsReceiver;
