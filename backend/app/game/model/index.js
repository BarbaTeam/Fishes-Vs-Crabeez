"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModel = void 0;
const game_engine_1 = require("./game-engine");
const quiz_handler_1 = require("./quiz-handler");
class GameModel {
    constructor(notifier, gameLobby) {
        this.gameEngine = new game_engine_1.GameEngine(this, notifier, gameLobby.playersId);
        this.quizHandler = new quiz_handler_1.QuizHandler(this, notifier, gameLobby.playersNotionsMask);
    }
    runOneFrame() {
        this.gameEngine.update();
    }
}
exports.GameModel = GameModel;
