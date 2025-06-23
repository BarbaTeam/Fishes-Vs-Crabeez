"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModel = void 0;
const game_engine_1 = require("./game-engine");
const quiz_handler_1 = require("./quiz-handler");
const events_handler_1 = require("./events-handler");
class GameModel {
    constructor(notifier, gameLobby, accumulator) {
        this.notifier = notifier;
        this.gameLobby = gameLobby;
        this.hasEnded = false;
        this.gameEngine = new game_engine_1.GameEngine(this, notifier, gameLobby.playersId);
        this.quizHandler = new quiz_handler_1.QuizHandler(this, notifier, gameLobby.playersNotionsMask, accumulator);
        this.eventsHandler = new events_handler_1.EventsHandler(this);
    }
    startup() {
        // TODO : Add more things in startup package :
        const startUpPackage = {
            players: this.gameEngine.getAllPlayers(),
        };
        console.log(`[MODEL] Startup package ${startUpPackage} prepared`);
        this.notifier.onStartup(startUpPackage);
    }
    runOneFrame() {
        this.gameEngine.update();
        this.eventsHandler.updateEvents();
    }
}
exports.GameModel = GameModel;
