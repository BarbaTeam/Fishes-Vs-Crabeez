"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRuntime = void 0;
const game_actions_receiver_1 = require("./game-actions-receiver");
const game_updates_notifier_1 = require("./game-updates-notifier");
const model_1 = require("../model");
class GameRuntime {
    constructor(io, gameLobby) {
        //this.notifier = new GameUpdatesNotifier(io.to(gameLobby.gameId));
        this.notifier = new game_updates_notifier_1.GameUpdatesNotifier(io, io.to(gameLobby.gameId));
        this.model = new model_1.GameModel(this.notifier, gameLobby);
        this.receiver = new game_actions_receiver_1.GameActionsReceiver(this.model);
    }
    runOneFrame() {
        // TODO : Supporting game's ending
        this.model.runOneFrame();
    }
}
exports.GameRuntime = GameRuntime;
