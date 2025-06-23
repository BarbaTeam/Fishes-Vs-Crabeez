"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRuntime = void 0;
const game_actions_receiver_1 = require("./game-actions-receiver");
const game_updates_notifier_1 = require("./game-updates-notifier");
const game_log_accumulator_1 = require("../model/game-log-accumulator");
const model_1 = require("../model");
const game_runner_1 = require("../../game-runner");
const stats_1 = require("../../stats");
class GameRuntime {
    constructor(io, game) {
        this.notifier = new game_updates_notifier_1.GameUpdatesNotifier(io, io.to(game.gameId));
        this.accumulator = new game_log_accumulator_1.GameLogAccumulator(game);
        this.model = new model_1.GameModel(this.notifier, game, this.accumulator);
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
        // TODO : enhanced game end
        this.notifier.onGameEnd();
        (0, stats_1.processGameLog)(this.accumulator.gamelog);
        (0, game_runner_1.stopRunningGame)(this.model.game.gameId);
    }
}
exports.GameRuntime = GameRuntime;
