"use strict";
exports.GameModel = void 0;
const game_engine_1 = require("./game-engine");
const quiz_handler_1 = require("./quiz-handler");
const events_handler_1 = require("./events-handler");
class GameModel {
    constructor(notifier, game, accumulator) {
        this.notifier = notifier;
        this.game = game;
        this.hasEnded = false;
        this.gameEngine = new game_engine_1.GameEngine(this, notifier, game.playersId);
        const playersConfigEntries = Object.entries(game.playersConfig);
        const playersNotionsMask = playersConfigEntries.reduce((acc, [playerId, config]) => {
            acc[playerId] = config.notionsMask;
            if (game.gameConfig.encrypted) {
                acc[playerId].ENCRYPTION = true;
            }
            return acc;
        }, {});
        this.quizHandler = new quiz_handler_1.QuizHandler(this, notifier, playersNotionsMask, accumulator);
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
