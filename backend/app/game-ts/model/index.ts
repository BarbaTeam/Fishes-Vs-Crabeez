import { GameLobby } from '../../shared/types';

import { GameUpdatesNotifier } from '../runtime/game-updates-notifier';

import { GameEngine } from "./game-engine";
import { QuizHandler } from './quiz-handler';


export class GameModel {
    public readonly gameEngine: GameEngine;
    public readonly quizHandler: QuizHandler;

    constructor (notifier: GameUpdatesNotifier, gameLobby: GameLobby) {
        this.gameEngine = new GameEngine(this, notifier, gameLobby.playersId);
        this.quizHandler = new QuizHandler(this, notifier, gameLobby.playersNotionsMask);
    }

    public runOneFrame() {
        this.gameEngine.update();
    }
}