import { Game, PlayerConfig, UserID, UserQuestionNotionsMask } from '../../shared/types';

import { GameUpdatesNotifier } from '../runtime/game-updates-notifier';
import { GameLogAccumulator } from '../model/game-log-accumulator';

import { GameEngine } from "./game-engine";
import { QuizHandler } from './quiz-handler';
import { EventsHandler } from './events-handler';



export class GameModel {
    public hasEnded = false;

    public readonly gameEngine: GameEngine;
    public readonly quizHandler: QuizHandler;
    public readonly eventsHandler: EventsHandler;

    constructor (
        private notifier: GameUpdatesNotifier,
        public game: Game,
        accumulator: GameLogAccumulator,
    ) {

        this.gameEngine = new GameEngine(this, accumulator, notifier, game.playersId);

        const playersConfigEntries = Object.entries(game.playersConfig) as [UserID, PlayerConfig][];
        const playersNotionsMask = playersConfigEntries.reduce(
            (acc, [playerId, config]) => {
                acc[playerId] = config.notionsMask;
                if (game.gameConfig.encrypted) {
                    acc[playerId].ENCRYPTION = true;
                }
                return acc;
            }, {} as Record<UserID, UserQuestionNotionsMask>
        );
        this.quizHandler = new QuizHandler(this, notifier, playersNotionsMask, accumulator);

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