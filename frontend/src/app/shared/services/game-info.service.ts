import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LocalStorageService } from './local-storage.service';

import { GameInfo } from '../models/game-log.model';
import { GameID } from '../models/ids';

import { MOCK_GAMES_INFO } from '../mocks/game-info.mock';



@Injectable({ providedIn: 'root' })
export class GameInfoService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        GAME_INFO_MAP: "gameInfoMap"
    } as const;

    // Internal State :
    private _gameInfoMap: Map<GameID, GameInfo> = new Map();


    // Internal Observable :
    private _gameInfoMap$: BehaviorSubject<Map<GameID, GameInfo>>
        = new BehaviorSubject(this._gameInfoMap);


    constructor(
        // private http: HttpClient,
        private localStorage: LocalStorageService,
    ) {
        const saved = this.localStorage.getData(
            GameInfoService.LocalStorageKey.GAME_INFO_MAP
        );
        if (saved !== null) {
            try {
                this._gameInfoMap = new Map(
                    JSON.parse(saved) as [GameID, GameInfo][]
                );
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }

        this._gameInfoMap$.next(this._gameInfoMap);
    }


    /**
     * @returns A promise resolving to the leaderboard corresponding to the game
     * if there is one, otherwise it resolves to `undefined`.
     */
    private async _fetchGameInfo(gameId: GameID): Promise<GameInfo|undefined> {
        // TODO : Replacing usage of local mocks w/ HTTP requests

        let ret = MOCK_GAMES_INFO.find(
            info => info.gameId === gameId
        );

        // NOTE : Asynchrone to ease the transition to an implementation using API call (see return stmt below)
        return Promise.resolve(ret);
        // return this.http.get<GameInfo>(
        //     `/api/games/info?gameId=${gameId}`
        // ).toPromise();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-services :

    /**
     * Récupère (lazy) un leaderboard par gameId.
     * Met à jour cache, localStorage et émet.
     */
    public getInfo$(gameId: GameID)
        : Observable<GameInfo|undefined>
    {
        if (this._gameInfoMap.has(gameId)) {
            // Early return as the leaderboard has already been cached
            return this._gameInfoMap$.pipe(
                map(m => m.get(gameId))
            );
        }

        from(this._fetchGameInfo(gameId)).pipe(
            tap(result => {
                if (!result) {
                    this._gameInfoMap$.next(this._gameInfoMap);
                    return;
                }

                this._gameInfoMap.set(gameId, result);
                this.localStorage.saveData(
                    GameInfoService.LocalStorageKey.GAME_INFO_MAP,
                    JSON.stringify([...this._gameInfoMap.entries()]),
                );
                this._gameInfoMap$.next(this._gameInfoMap);
            }),
            catchError(() => [undefined]),
        ).subscribe();

        return this._gameInfoMap$.pipe(
            map(m => m.get(gameId))
        );
    }
}
