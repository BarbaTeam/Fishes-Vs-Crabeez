import { GameLobby } from '../../shared/types';

import { GameUpdatesNotifier } from '../runtime/game-updates-notifier';

import { GameLogAccumulator } from './game-log-accumulator';
import { GameEngine } from "./game-engine";
import { QuizHandler } from './quiz-handler';
import { EventsHandler } from './events-handler';
import { GameRuntime } from '../../game/runtime';



export class GameModel {
    private _accumulator: GameLogAccumulator;

    public hasEnded = false;

    public readonly gameEngine: GameEngine;
    public readonly quizHandler: QuizHandler;
    public readonly eventsHandler: EventsHandler;

    constructor (
        private notifier: GameUpdatesNotifier,
        public gameLobby: GameLobby
    ) {
        this._accumulator = new GameLogAccumulator(gameLobby.playersId);

        this.gameEngine = new GameEngine(this, notifier, gameLobby.playersId);

        this.quizHandler = new QuizHandler(this, notifier, gameLobby.playersNotionsMask, this._accumulator);

        this.eventsHandler = new EventsHandler(this);
    }

    public startup(): void {
        // TODO : Add more things in startup package :
        const startUpPackage: any = {
            players: this.gameEngine.getAllPlayers(),
        };

        console.log(`[MODEL] Startup package ${startUpPackage} prepared`);

        this.notifier.onStartup(startUpPackage)
    }

    public runOneFrame(): void {
        this.gameEngine.update();
        this.eventsHandler.updateEvents();
    }
}