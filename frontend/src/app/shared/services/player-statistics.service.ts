import { Injectable } from "@angular/core";
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";

import { UserService } from "./user.service";
import { LocalStorageService } from "./local-storage.service";

import { User } from "../models/user.model";
import { PlayerStatistics } from "../models/player-results.model";

import { MOCK_PLAYER_STATISTICS_PLACEHOLDERS } from "../mocks/players-statistics.mock";



@Injectable({
    providedIn: 'root'
})
export class PlayerStatisticsService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        PLAYER_STATISTICS: "playerStatistics"
    } as const;


    // Internal State :
    private user!: User;
    private _playerStatistics: PlayerStatistics = {} as PlayerStatistics;

    // Public Observables :
    public readonly isLoading$: BehaviorSubject<boolean>
        = new BehaviorSubject(false);
    public readonly playerStatistics$: BehaviorSubject<PlayerStatistics>
        = new BehaviorSubject(this._playerStatistics);

    constructor(
        // private http: HttpClient,
        private userService: UserService,
        private localStorageService: LocalStorageService,
    ) {
        const saved = this.localStorageService.getData(
            PlayerStatisticsService.LocalStorageKey.PLAYER_STATISTICS
        );
        if (saved !== null) {
            try {
                this._playerStatistics = JSON.parse(saved);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }

        this.playerStatistics$.next(this._playerStatistics);

        this.userService.selectedUser$.subscribe(async (user: User) => {
            this.user = user;

            this.isLoading$.next(true);
            this._setPlayerStatistics(await this._fetchPlayerStatistics());
            this.isLoading$.next(false);
        });
    }


    ///////////////////////////////////////////////////////////////////////////.
    // Utils :

    /**
     * Set the value of the internal statics, emit the new player's statistics
     * and save it in the `localStorage`.
     * @param newPlayerStatistics The new player's statistics.
     */
    private _setPlayerStatistics(newPlayerStatistics: PlayerStatistics): void {
        this._playerStatistics = newPlayerStatistics;
        this.localStorageService.saveData(
            PlayerStatisticsService.LocalStorageKey.PLAYER_STATISTICS,
            JSON.stringify(this._playerStatistics),
        );
        this.playerStatistics$.next(this._playerStatistics);
    }

    /**
     * @returns A promise resolving to the player's statistics.
     */
    private async _fetchPlayerStatistics(): Promise<PlayerStatistics> {
        // TODO : Directly asking for the 5 latest player results instead of fetching them all
        // TODO : Replacing usage of local mocks w/ HTTP requests

        const ret: PlayerStatistics = MOCK_PLAYER_STATISTICS_PLACEHOLDERS
            .find((stats) =>
                stats.playerId === this.user.userId
            )!;

        // NOTE : Asynchrone to ease the transition to an implementation using API call (see return stmt below)
        return Promise.resolve(ret);
        // return this.http.get<PlayerResults[]>(
        //     `/api/users/${this.user.id}/statistics`
        // ).toPromise();
    }
}
