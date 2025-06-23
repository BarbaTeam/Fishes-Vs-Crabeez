"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRuntime = void 0;
const game_actions_receiver_1 = require("./game-actions-receiver");
const game_updates_notifier_1 = require("./game-updates-notifier");
const model_1 = require("../model");
const game_runner_1 = require("../../game-runner");
class GameRuntime {
    constructor(io, gameLobby) {
        //this.notifier = new GameUpdatesNotifier(io.to(gameLobby.gameId));
        this.notifier = new game_updates_notifier_1.GameUpdatesNotifier(io, io.to(gameLobby.gameId));
        this.model = new model_1.GameModel(this.notifier, gameLobby);
        this.receiver = new game_actions_receiver_1.GameActionsReceiver(this.model);
    }
    runOneFrame() {
        if (this.model.hasEnded) {
            this.onGameEnd();
            return;
        }
        this.model.runOneFrame();
    }
    onGameEnd() {
        //TODO : enhanced game end
        this.notifier.onGameEnd();
        (0, game_runner_1.stopRunningGame)(this.model.gameLobby.gameId);
    }
}
exports.GameRuntime = GameRuntime;

