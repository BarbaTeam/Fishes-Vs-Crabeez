import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LocalStorageService } from './localStorage.service';

import { GameLeaderboard } from '../models/game-leaderboard.model';
import { GameID } from '../models/ids';

import { MOCK_GAMES_LEADERBOARD } from "../mocks/game-leaderboard.mock";



@Injectable({ providedIn: 'root' })
export class GameLeaderboardService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        GAME_LEADERBOARD_MAP: "gameLeaderboardMap"
    } as const;


    // Internal State :
    private _gameLeaderboardMap = new Map<GameID, GameLeaderboard>();
    private _subject = new BehaviorSubject<Map<GameID, GameLeaderboard>>(
        new Map()
    );


    // Public Observables :
    public readonly gameLeaderboardMap$ = this._subject.asObservable();


    constructor(
        // private http: HttpClient,
        private localStorage: LocalStorageService,
    ) {
        this._gameLeaderboardMap = new Map();

        const saved = this.localStorage.getData(
            GameLeaderboardService.LocalStorageKey.GAME_LEADERBOARD_MAP
        );
        if (saved !== null) {
            try {
                this._gameLeaderboardMap = new Map(
                    JSON.parse(saved) as [GameID, GameLeaderboard][]
                );
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }

        this._subject.next(this._gameLeaderboardMap);
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
     * Récupère (lazy) un leaderboard par gameId.
     * Met à jour cache, localStorage et émet.
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
                    GameLeaderboardService.LocalStorageKey.GAME_LEADERBOARD_MAP,
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
