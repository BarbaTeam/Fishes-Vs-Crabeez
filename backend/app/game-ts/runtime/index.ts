import { Server } from 'socket.io';

import { GameLobby } from '../../shared/types';

import { GameActionsReceiver } from './game-actions-receiver';
import { GameUpdatesNotifier } from './game-updates-notifier';
import { GameModel } from '../model';

import { stopRunningGame } from '../../game-runner'

export class GameRuntime {
    public readonly notifier : GameUpdatesNotifier;
    public readonly model    : GameModel;
    public readonly receiver : GameActionsReceiver;

    constructor (io: Server, gameLobby: GameLobby) {
        //this.notifier = new GameUpdatesNotifier(io.to(gameLobby.gameId));
        this.notifier = new GameUpdatesNotifier(io, io.to(gameLobby.gameId));
        this.model    = new GameModel(this.notifier, gameLobby);
        this.receiver = new GameActionsReceiver(this.model);
    }

    public runOneFrame() {
        if(this.model.hasEnded){
            this.onGameEnd();
            return;
        }
        this.model.runOneFrame();
    }

    public onGameEnd(){
        //TODO : enhanced game end
        this.notifier.onGameEnd();
        stopRunningGame(this.model.gameLobby.gameId);
    }
}
