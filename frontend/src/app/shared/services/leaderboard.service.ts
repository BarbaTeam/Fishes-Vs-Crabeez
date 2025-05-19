import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, from, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HTTP_API } from '@app/app-settings';

import { LocalStorageService } from './local-storage.service';

import { GameLeaderboard, GlobalLeaderboard } from '../models/leaderboard.model';
import { GameID } from '../models/ids';



@Injectable({
    providedIn: 'root'
})
export class LeaderboardService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        GAME_LEADERBOARD_MAP: "gameLeaderboardMap",
        GLOBAL_LEADERBOARD: "globalLeaderboard",
    } as const;


    // Internal State :
    private _gameLeaderboardMap: Map<GameID, GameLeaderboard> = new Map();


    // Internal Observables :
    private readonly _gameLeaderboardMap$: BehaviorSubject<
        Map<GameID, GameLeaderboard>
    >
        = new BehaviorSubject(this._gameLeaderboardMap);


    // Public Observables :
    public get globalLeaderboard$(): Observable<GlobalLeaderboard> {
        return from(this._fetchGlobalLeaderboard());
    }


    constructor(
        private http: HttpClient,
        private localStorage: LocalStorageService,
    ) {
        // Game Leaderboards :
        const savedGameLeaderboardMap = this.localStorage.getData(
            LeaderboardService.LocalStorageKey.GAME_LEADERBOARD_MAP
        );
        if (
            savedGameLeaderboardMap !== null
            && savedGameLeaderboardMap !== undefined
        ) {
            try {
                this._gameLeaderboardMap = new Map(JSON.parse(
                    savedGameLeaderboardMap
                ) as [GameID, GameLeaderboard][]);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }

        this._gameLeaderboardMap$.next(this._gameLeaderboardMap);
    }


    ///////////////////////////////////////////////////////////////////////////.
    // API Calls :

    private async _fetchGlobalLeaderboard(): Promise<GlobalLeaderboard> {
        return firstValueFrom(this.http.get<GlobalLeaderboard>(
            `${HTTP_API}/global-leaderboard`
        ));
    }

    /**
     * @returns A promise resolving to the leaderboard corresponding to the game
     * if there is one, otherwise it resolves to `undefined`.
     */
    private async _fetchGameLeaderboard(gameId: GameID)
        : Promise<GameLeaderboard|undefined>
    {
        return firstValueFrom(this.http.get<GameLeaderboard>(
            `${HTTP_API}/game-leaderboards/${gameId}`
        ));
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-Observables :

    /**
     * @return An Observable that will emit the leaderboard corresponding
     * to the gameId once it has been fetched.
     *
     * @implNote It caches the leaderboard in the localStorage to not have
     * to always fetch.
     */
    public getGameLeaderboardById$(gameId: GameID)
        : Observable<GameLeaderboard|undefined>
    {
        if (this._gameLeaderboardMap.has(gameId)) {
            // Early return as the leaderboard has already been cached
            return this._gameLeaderboardMap$.pipe(
                map(m => m.get(gameId))
            );
        }

        from(this._fetchGameLeaderboard(gameId)).pipe(
            tap(result => {
                if (!result) {
                    this._gameLeaderboardMap$.next(this._gameLeaderboardMap);
                    return;
                }

                this._gameLeaderboardMap.set(gameId, result);
                this.localStorage.saveData(
                    LeaderboardService.LocalStorageKey.GAME_LEADERBOARD_MAP,
                    JSON.stringify([...this._gameLeaderboardMap.entries()]),
                );
                this._gameLeaderboardMap$.next(this._gameLeaderboardMap);
            }),
            catchError(() => [undefined]),
        ).subscribe();

        let ret = this._gameLeaderboardMap$.pipe(
            map(m => m.get(gameId))
        );

        return ret;
    }
}
