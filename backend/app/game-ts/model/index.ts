import { GameLobby } from '../../shared/types';

import { GameUpdatesNotifier } from '../runtime/game-updates-notifier';

import { GameEngine } from "./game-engine";
import { QuizHandler } from './quiz-handler';


export class GameModel {
    private gameEngine: GameEngine;
    private quizHandler: QuizHandler;

    /**
     * @param {GameEventsNotifier} notifier
     * @param {GameLobby} gameLobby
     */
    constructor (notifier: GameUpdatesNotifier, gameLobby: GameLobby) {
        // TODO : Using 'gameLobby'

        this.gameEngine = new GameEngine(notifier);
        this.quizHandler = new QuizHandler(notifier);
    }

    public runOneFrame() {
        this.gameEngine.update();
    }
}