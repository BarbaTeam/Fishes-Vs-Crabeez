import { Server } from 'socket.io';

import { GameLobby } from '../../shared/types';

import { GameActionsReceiver } from './game-actions-receiver';
import { GameUpdatesNotifier } from './game-updates-notifier';
import { GameModel } from '../model';


export class GameRuntime {
    public readonly notifier : GameUpdatesNotifier;
    public readonly model    : GameModel;
    public readonly receiver : GameActionsReceiver;

    constructor (io: Server, gameLobby: GameLobby) {
        this.notifier = new GameUpdatesNotifier(io);
        this.model    = new GameModel(this.notifier, gameLobby);
        this.receiver = new GameActionsReceiver(this.model);
    }

    public runOneFrame() {
        // TODO : Supporting game's ending
        this.model.runOneFrame();
    }
}
