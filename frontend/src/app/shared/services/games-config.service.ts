import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { SocketService } from './socket.service';
import { LocalStorageService } from './local-storage.service';

import { GameConfig } from '../models/game-config.model';
import { GameLobby } from '../models/game-lobby.model';
import { GameID } from '@app/shared/models/ids';


/*
@Injectable({
  providedIn: 'root'
})
export class GamesConfigService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        SELECTED_GAME_CONFIG: "selectedGameConfig"
    } as const;


    // Internal State:
    private _gamesConfigMap: Map<GameID, GameConfig> = new Map();
    private _selectedGameConfig: GameConfig = {} as GameConfig;


    // Internal Observables :
    private readonly _gamesConfigMap$: BehaviorSubject<Map<GameID, GameConfig>>
        = new BehaviorSubject(this._gamesConfigMap);


    // Public Observables :
    public readonly selectedGameConfig$: BehaviorSubject<GameConfig>
        = new BehaviorSubject(this._selectedGameConfig);

    constructor(
        private socket: SocketService,
        private localStorageService: LocalStorageService,
    ) {
        this._startup()

        // Selected Game Lobby :
        const saved = this.localStorageService.getData(
            GamesConfigService.LocalStorageKey.SELECTED_GAME_CONFIG
        );
        if (saved !== null) {
            try {
                this._selectedGameConfig = JSON.parse(saved);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }
        this.selectedGameConfig$.next(this._selectedGameConfig);


        // Listeners :
        this.socket.on<{lobby: GameLobby, config: GameConfig}>('gameOpened').subscribe(
            ({lobby, config})  => {
                this._gamesConfigMap.set(lobby.gameId, config);
                this._updateObservable();
            }
        );

        this.socket.on<{lobby: GameLobby, config: GameConfig}>('gameUpdated').subscribe(
            ({lobby, config}) => {
                this._gamesConfigMap.set(lobby.gameId, config);
                this._updateObservable();
            }
        );

        this.socket.on<GameID>('gameClosed').subscribe(
            gameId => {
                this._gamesConfigMap.delete(gameId);
                this._updateObservable();
            }
        );
    }


    private _startup() {
        this.socket.onReady(() => {
            this.socket.sendMessage('requestAllGames', {});
        });
        this.socket.on<GameLobby[]>('allGames')
            .pipe(first()) // <-- one time subscription
            .subscribe((games) => {
                for (let game of games) {
                    this._gamesConfigMap.set(game.gameId, game);
                }
                this._updateObservable();
            });
    }


    private _updateObservable() {
        this._gamesConfigMap$.next(this._gamesConfigMap);

        if (this._selectedGameConfig?.gameId) {
            this.selectGameLobby(this._selectedGameConfig.gameId);
        }
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-Observables :

    public getGameLobbyById$(gameId: GameID): Observable<GameConfig | undefined> {
        return this._gamesConfigMap$.pipe(
            map(gameLobbiesMap => gameLobbiesMap.get(gameId))
        );
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    public selectGameLobby(gameId: GameID) {
        this._selectedGameConfig = this._gamesConfigMap.get(gameId)!;
        if (this._selectedGameConfig) {
            this.selectedGameConfig$.next(this._selectedGameConfig);
            this.localStorageService.saveData(
                GamesConfigService.LocalStorageKey.SELECTED_GAME_CONFIG,
                JSON.stringify(this._selectedGameConfig)
            );
        }
        this.selectedGameConfig$.next(this._selectedGameConfig);
    }
}
*/