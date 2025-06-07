"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameActionsReceiver = void 0;
class GameActionsReceiver {
    constructor(model) {
        this.model = model;
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
