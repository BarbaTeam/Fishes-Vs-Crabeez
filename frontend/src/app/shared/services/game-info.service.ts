import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HTTP_API } from '@app/app-settings';

import { LocalStorageService } from './local-storage.service';

import { GameID } from '@app/shared/models/ids';
import { GameInfo } from '@app/shared/models/game-log.model';



@Injectable({
    providedIn: 'root'
})
export class GameInfoService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        GAME_INFO_MAP: "gameInfoMap"
    } as const;

    // Internal State :
    private _gameInfoMap: Map<GameID, GameInfo> = new Map();


    // Internal Observables :
    private _gameInfoMap$: BehaviorSubject<Map<GameID, GameInfo>>
        = new BehaviorSubject(this._gameInfoMap);


    constructor(
        private http: HttpClient,
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


    ////////////////////////////////////////////////////////////////////////////
    // API Calls :

    /**
     * @returns A promise resolving to the leaderboard corresponding to the game
     * if there is one, otherwise it resolves to `undefined`.
     */
    private async _fetchGameInfo(gameId: GameID): Promise<GameInfo> {
        return firstValueFrom(this.http.get<GameInfo>(
            `${HTTP_API}/game-infos/${gameId}`
        ));
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-Observables :

    /**
     * Récupère (lazy) un leaderboard par gameId.
     * Met à jour cache, localStorage et émet.
     */
    public getGameInfoById$(gameId: GameID)
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
