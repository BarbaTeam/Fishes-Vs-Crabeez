import { GameLobby } from '../../shared/types';

import { GameUpdatesNotifier } from '../runtime/game-updates-notifier';

import { GameEngine } from "./game-engine";
import { QuizHandler } from './quiz-handler';


export class GameModel {
    public readonly gameEngine: GameEngine;
    public readonly quizHandler: QuizHandler;

    constructor (
        private notifier: GameUpdatesNotifier,
        private gameLobby: GameLobby
    ) {
        this.gameEngine = new GameEngine(this, notifier, gameLobby.playersId);
        this.quizHandler = new QuizHandler(this, notifier, gameLobby.playersNotionsMask);
    }

    public startup() {
        // TODO : Add more things in startup package :
        const startUpPackage: any = {
            players: this.gameEngine.getAllPlayers(),
        };

        console.log(`[MODEL] Startup package ${startUpPackage} prepared`);

        this.notifier.onStartup(startUpPackage)
    }

    public runOneFrame() {
        this.gameEngine.update();
    }
}