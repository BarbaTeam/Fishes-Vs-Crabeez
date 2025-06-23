import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LocalStorageService } from './local-storage.service';

import { GameLeaderboard, GlobalLeaderboard } from '../models/leaderboard.model';
import { GameID } from '../models/ids';

import {
    MOCK_GAMES_LEADERBOARD,
    MOCK_GLOBAL_LEADERBOARD_PLACEHOLDER,
} from "../mocks/leaderboard.mock";



@Injectable({
    providedIn: 'root'
})
export class LeaderboardService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        GAME_LEADERBOARD_MAP: "gameLeaderboardMap",
    } as const;


    // Internal State :
    private _gameLeaderboardMap = new Map<GameID, GameLeaderboard>();
    private _subject = new BehaviorSubject<Map<GameID, GameLeaderboard>>(
        new Map()
    );


    // Public Observables :
    public readonly globalLeaderBoard$: BehaviorSubject<GlobalLeaderboard>
        = new BehaviorSubject({} as GlobalLeaderboard);
    public readonly gameLeaderboardMap$ = this._subject.asObservable();


    constructor(
        // private http: HttpClient,
        private localStorage: LocalStorageService,
    ) {
        // Global Leaderboard :
        from(this._fetchGlobalLeaderboard()).subscribe({
            next : value => this.globalLeaderBoard$.next(value),
            error: err   => console.error(err),
        });


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

        this._subject.next(this._gameLeaderboardMap);
    }


    private async _fetchGlobalLeaderboard()
        : Promise<GlobalLeaderboard>
    {
        // TODO : Replacing usage of local mocks w/ HTTP requests

        let ret = MOCK_GLOBAL_LEADERBOARD_PLACEHOLDER;

        // NOTE : Asynchrone to ease the transition to an implementation using API call (see return stmt below)
        return Promise.resolve(ret);
        // return this.http.get<GlobalLeaderboard>(
        //     `/api/games/leaderboard`
        // ).toPromise();
    }


    /**
     * @returns A promise resolving to the leaderboard corresponding to the game
     * if there is one, otherwise it resolves to `undefined`.
     */
    private async _fetchGameLeaderboard(gameId: GameID)
        : Promise<GameLeaderboard|undefined>
    {
        // TODO : Replacing usage of local mocks w/ HTTP requests

        let ret = MOCK_GAMES_LEADERBOARD.find(
            leaderboard => leaderboard.gameId === gameId
        );

        // NOTE : Asynchrone to ease the transition to an implementation using API call (see return stmt below)
        return Promise.resolve(ret);
        // return this.http.get<GameLeaderboard>(
        //     `/api/games/leaderboard?gameId=${gameId}`
        // ).toPromise();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Sub-services :

    /**
     * @return An Observable that will emit the leaderboard corresponding
     * to the gameId once it has been fetched.
     *
     * @implNote It caches the leaderboard in the localStorage to not have
     * to always fetch.
     */
    public getLeaderboard$(gameId: GameID)
        : Observable<GameLeaderboard|undefined>
    {
        if (this._gameLeaderboardMap.has(gameId)) {
            // Early return as the leaderboard has already been cached
            return this.gameLeaderboardMap$.pipe(
                map(m => m.get(gameId))
            );
        }

        from(this._fetchGameLeaderboard(gameId)).pipe(
            tap(result => {
                if (!result) {
                    this._subject.next(this._gameLeaderboardMap);
                    return;
                }

                this._gameLeaderboardMap.set(gameId, result);
                this.localStorage.saveData(
                    LeaderboardService.LocalStorageKey.GAME_LEADERBOARD_MAP,
                    JSON.stringify([...this._gameLeaderboardMap.entries()]),
                );
                this._subject.next(this._gameLeaderboardMap);
            }),
            catchError(() => [undefined]),
        ).subscribe();

        let ret = this.gameLeaderboardMap$.pipe(
            map(m => m.get(gameId))
        );

        return ret;
    }
}
