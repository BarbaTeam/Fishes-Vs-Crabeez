import { Server } from 'socket.io';

import { Game } from '../../shared/types';

import { GameActionsReceiver } from './game-actions-receiver';
import { GameUpdatesNotifier } from './game-updates-notifier';
import { GameLogAccumulator } from '../model/game-log-accumulator';
import { GameModel } from '../model';

import { stopRunningGame } from '../../game-runner'

import { processGameLog } from '../../stats';



export class GameRuntime {
    public readonly notifier   : GameUpdatesNotifier;
    public readonly model      : GameModel;
    public readonly receiver   : GameActionsReceiver;
    public readonly accumulator: GameLogAccumulator;

    private timeout?: NodeJS.Timeout;

    constructor (io: Server, game: Game) {
        this.notifier    = new GameUpdatesNotifier(io, io.to(game.gameId));
        this.accumulator = new GameLogAccumulator(game);
        this.model       = new GameModel(this.notifier, game, this.accumulator);
        this.receiver    = new GameActionsReceiver(this.model);

        const maxDurationInMin: number|"inf" = game.gameConfig.maxDuration;
        if (maxDurationInMin !== "inf") {
            this.timeout = setTimeout(
                () => this.onGameEnd(),
                maxDurationInMin * 60000, // 1 min = 60000 ms
            )
        }
    }

    public runOneFrame(): void {
        if(this.model.hasEnded || this.model.game.playersId.length === 0){
            if (this.model.game.playersId.length === 0) {
                setTimeout(() => {
                    if (this.model.game.playersId.length === 0) {
                        this.onGameEnd();
                    }
                }, 10000);
            } else if (process.env.TEST_E2E) {
                this.onGameEnd();
            } else {
                this.onForcedGameEnd();
            }
            return;
        }

        this.model.runOneFrame();
    }

    public onGameEnd(): void {
        if (this?.timeout) {
            this.timeout.close();
        }

        this.notifier.onGameEnd();
        if (!this.accumulator.isEmpty()) {
            processGameLog(this.accumulator.gamelog);
        }

        stopRunningGame(this.model.game.gameId);
    }

    public onForcedGameEnd(): void {
        if (this?.timeout) {
            this.timeout.close();
        }
        this.notifier.onGameEnd();
        stopRunningGame(this.model.game.gameId);
    }
}
