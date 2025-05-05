import { Injectable } from "@angular/core";
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";

import { UserService } from "./user.service";
import { LocalStorageService } from "./local-storage.service";

import { User } from "../models/user.model";
import { PlayerResults } from "../models/player-results.model";

import { MOCK_PLAYERS_RESULTS } from "../mocks/players-results.mock";



@Injectable({
    providedIn: 'root'
})
export class PlayerResultsService {
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        PLAYER_RESULTS_LIST: "playerResultsList"
    } as const;


    // Internal State :
    private user!: User;
    private _playerResultsList: PlayerResults[] = [] as PlayerResults[];


    // Public Observables :
    public readonly isLoading$: BehaviorSubject<boolean>
        = new BehaviorSubject(false);
    public readonly playerResultsList$: BehaviorSubject<PlayerResults[]>
        = new BehaviorSubject(this._playerResultsList);


    constructor(
        // private http: HttpClient,
        private userService: UserService,
        private localStorageService: LocalStorageService,
    ) {
        const saved = this.localStorageService.getData(
            PlayerResultsService.LocalStorageKey.PLAYER_RESULTS_LIST
        );
        if (saved !== null) {
            try {
                this._playerResultsList = JSON.parse(saved);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }

        this.playerResultsList$.next(this._playerResultsList);

        this.userService.selectedUser$.subscribe(async (user: User) => {
            this.user = user;

            this.isLoading$.next(true);
            this._setPlayerResultsList(await this._fetchLatestPlayerResults());
            this.isLoading$.next(false);
        });
    }


    ///////////////////////////////////////////////////////////////////////////.
    // Utils :

    /**
     * Set the value of the internal array, emit the new array and save it
     * in the `localStorage`.
     * @param newPlayerResultsList The new array.
     */
    private _setPlayerResultsList(newPlayerResultsList: PlayerResults[]): void {
        this._playerResultsList = newPlayerResultsList;
        this.localStorageService.saveData(
            PlayerResultsService.LocalStorageKey.PLAYER_RESULTS_LIST,
            JSON.stringify(this._playerResultsList),
        );
        this.playerResultsList$.next(this._playerResultsList);
    }

    /**
     * @returns A promise resolving to an array of the 5 latest player results
     * corresponding to the selected user.
     */
    private async _fetchLatestPlayerResults(): Promise<PlayerResults[]> {
        // TODO : Replacing usage of local mocks w/ HTTP requests

        const ret: PlayerResults[] = MOCK_PLAYERS_RESULTS
            .filter((res) =>
                res.playerId === this.user.userId
            )
            .sort((res1, res2) =>
                -(parseInt(res1.gameId.slice(1)) - parseInt(res2.gameId.slice(1)))
            )
            .slice(0, 5);

        // NOTE : Asynchrone to ease the transition to an implementation using API call (see return stmt below)
        return Promise.resolve(ret);
        // return this.http.get<PlayerResults[]>(
        //     `/api/users/${this.user.id}/results?limit=5`
        // ).toPromise();
    }


    ///////////////////////////////////////////////////////////////////////////.
    // Operations :

    /**
     * Enqueue a player results to the list.
     * Useful to prevent loss of time by enabling receiving only new results.
     * @param newResultsList An array of new player results to enqueue.
     */
    public enqueuePlayerResults(...newResults: PlayerResults[]): void {
        this._setPlayerResultsList([...newResults, ...this._playerResultsList]);
    }
}
