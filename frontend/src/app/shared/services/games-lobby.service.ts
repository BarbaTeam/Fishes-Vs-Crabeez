import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { SocketService } from './socket.service';
import { LocalStorageService } from './local-storage.service';

import { GameLobby, GameLobbyState } from '@app/shared/models/game-lobby.model';
import { GameID } from '@app/shared/models/ids';



@Injectable({
  providedIn: 'root'
})
export class GamesLobbyService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        SELECTED_GAME_LOBBY: "selectedGameLobby"
    } as const;


    // Internal State:
    private _gamesLobbyMap: Map<GameID, GameLobby> = new Map();
    private _selectedGameLobby: GameLobby = {} as GameLobby;


    // Internal Observables :
    private readonly _gamesLobbyMap$: BehaviorSubject<Map<GameID, GameLobby>>
        = new BehaviorSubject(this._gamesLobbyMap);


    // Public Observables :
    public readonly gamesLobbyPerStates$: BehaviorSubject<Record<GameLobbyState, GameLobby[]>>
        = new BehaviorSubject({
            [GameLobbyState.RUNNING]: [] as GameLobby[],
            [GameLobbyState.WAITING]: [] as GameLobby[],
        });
    public readonly selectedGameLobby$: BehaviorSubject<GameLobby>
        = new BehaviorSubject(this._selectedGameLobby);

    constructor(
        private socket: SocketService,
        private localStorageService: LocalStorageService,
    ) {
        this._startup()

        // Selected Game Lobby :
        const saved = this.localStorageService.getData(
            GamesLobbyService.LocalStorageKey.SELECTED_GAME_LOBBY
        );
        if (saved !== null) {
            try {
                this._selectedGameLobby = JSON.parse(saved);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }
        this.selectedGameLobby$.next(this._selectedGameLobby);


        // Listeners :
        this.socket.on<GameLobby>('gameOpened').subscribe(
            game => {
                this._gamesLobbyMap.set(game.gameId, game);
                this._updateObservable();
            }
        );

        this.socket.on<GameID>('gameClosed').subscribe(
            gameId => {
                this._gamesLobbyMap.delete(gameId);
                this._updateObservable();
            }
        );

        this.socket.on<GameID>('gameStarted').subscribe(
            gameId => {
                this._gamesLobbyMap.get(gameId)!.state = GameLobbyState.RUNNING;
                this._updateObservable();
            }
        );

        this.socket.on<GameLobby>('gameUpdated').subscribe(
            game => {
                // DEBUG ::
                console.log(game);
                this._gamesLobbyMap.set(game.gameId, game);
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
                    this._gamesLobbyMap.set(game.gameId, game);
                }
                this._updateObservable();
            });
    }


    private _updateObservable() {
        this._gamesLobbyMap$.next(this._gamesLobbyMap);

        const gameLobbies = Array.from(this._gamesLobbyMap.values());
        this.gamesLobbyPerStates$.next({
            [GameLobbyState.RUNNING]: gameLobbies.filter(l => l.state === GameLobbyState.RUNNING),
            [GameLobbyState.WAITING]: gameLobbies.filter(l => l.state === GameLobbyState.WAITING),
        })

        this.selectGameLobby(this._selectedGameLobby.gameId);
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-Observables :

    public getGameLobbyById$(gameId: GameID): Observable<GameLobby | undefined> {
        return this._gamesLobbyMap$.pipe(
            map(gameLobbiesMap => gameLobbiesMap.get(gameId))
        );
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    public selectGameLobby(gameId: GameID) {
        this._selectedGameLobby = this._gamesLobbyMap.get(gameId)!;
        if (this._selectedGameLobby) {
            this.selectedGameLobby$.next(this._selectedGameLobby);
            this.localStorageService.saveData(
                GamesLobbyService.LocalStorageKey.SELECTED_GAME_LOBBY,
                JSON.stringify(this._selectedGameLobby)
            );
        }
        this.selectedGameLobby$.next(this._selectedGameLobby);
    }
}
