import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { SocketService } from './socket.service';
import { LocalStorageService } from './local-storage.service';

import { Game, GameState, GameLobby, GameConfig } from '@app/shared/models/game.model';
import { GameID } from '@app/shared/models/ids';



@Injectable({
  providedIn: 'root'
})
export class GamesService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        SELECTED_GAME_LOBBY: "selectedGame"
    } as const;


    // Internal State:
    private _gamesMap: Map<GameID, Game> = new Map();
    private _selectedGame: Game = {} as Game;


    // Internal Observables :
    private readonly _gamesMap$: BehaviorSubject<Map<GameID, Game>>
        = new BehaviorSubject(this._gamesMap);


    // Public Observables :
    public readonly gamesPerStates$: BehaviorSubject<Record<GameState, Game[]>>
        = new BehaviorSubject({
            [GameState.RUNNING]: [] as Game[],
            [GameState.WAITING]: [] as Game[],
        });
    public readonly selectedGame$: BehaviorSubject<Game>
        = new BehaviorSubject(this._selectedGame);

    constructor(
        private socket: SocketService,
        private localStorageService: LocalStorageService,
    ) {
        this._startup()

        // Selected Game Lobby :
        const saved = this.localStorageService.getData(
            GamesService.LocalStorageKey.SELECTED_GAME_LOBBY
        );
        if (saved !== null) {
            try {
                this._selectedGame = JSON.parse(saved);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }
        this.selectedGame$.next(this._selectedGame);


        // Listeners :
        this.socket.on<Game>('gameOpened').subscribe(
            game => {
                this._gamesMap.set(game.gameId, game);
                this._updateObservable();
            }
        );

        this.socket.on<GameID>('gameClosed').subscribe(
            gameId => {
                this._gamesMap.delete(gameId);
                this._updateObservable();
            }
        );

        this.socket.on<GameID>('gameStarted').subscribe(
            gameId => {
                this._gamesMap.get(gameId)!.state = GameState.RUNNING;
                this._updateObservable();
            }
        );

        this.socket.on<Game>('gameUpdated').subscribe(
            game => {
                this._gamesMap.set(game.gameId, game);
                this._updateObservable();
            }
        );
    }


    private _startup() {
        this.socket.onReady(() => {
            this.socket.sendMessage('requestAllGames', {});
        });
        this.socket.on<Game[]>('allGames')
            .pipe(first()) // <-- one time subscription
            .subscribe((games) => {
                for (let game of games) {
                    this._gamesMap.set(game.gameId, game);
                }
                this._updateObservable();
            });
    }


    private _updateObservable() {
        this._gamesMap$.next(this._gamesMap);

        const gameLobbies = Array.from(this._gamesMap.values());
        this.gamesPerStates$.next({
            [GameState.RUNNING]: gameLobbies.filter(l => l.state === GameState.RUNNING),
            [GameState.WAITING]: gameLobbies.filter(l => l.state === GameState.WAITING),
        })

        if (this._selectedGame?.gameId) {
            this.selectGame(this._selectedGame.gameId);
        }
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    public selectGame(gameId: GameID) {
        this._selectedGame = this._gamesMap.get(gameId)!;
        if (this._selectedGame) {
            this.selectedGame$.next(this._selectedGame);
            this.localStorageService.saveData(
                GamesService.LocalStorageKey.SELECTED_GAME_LOBBY,
                JSON.stringify(this._selectedGame)
            );
        }
        this.selectedGame$.next(this._selectedGame);
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-Observables :

    public getGameById$(gameId: GameID): Observable<Game | undefined> {
        return this._gamesMap$.pipe(
            map(gameLobbiesMap => gameLobbiesMap.get(gameId))
        );
    }
}



export namespace GameTools {
    export function toLobby(game: Game): GameLobby {
        return {
            gameId: game.gameId,
            name: game.name,
            state: game.state,
            playersId: game.playersId,
        };
    }

    export function toConfig(game: Game): GameConfig {
        return {
            gameId: game.gameId,
            ...game.gameConfig,
        };
    }
}
