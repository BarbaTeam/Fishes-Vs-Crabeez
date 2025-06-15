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

    constructor (io: Server, game: Game) {
        this.notifier    = new GameUpdatesNotifier(io, io.to(game.gameId));
        this.accumulator = new GameLogAccumulator(game);
        this.model       = new GameModel(this.notifier, game, this.accumulator);
        this.receiver    = new GameActionsReceiver(this.model);
    }

    public runOneFrame() {
        if(this.model.hasEnded){
            this.onGameEnd();
            return;
        }
        this.model.runOneFrame();
    }

    public onGameEnd(){
        // TODO : enhanced game end
        this.notifier.onGameEnd();
        processGameLog(this.accumulator.gamelog);
        stopRunningGame(this.model.game.gameId);
    }
}
