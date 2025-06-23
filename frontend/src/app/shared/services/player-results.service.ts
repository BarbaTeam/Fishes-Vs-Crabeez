import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from "rxjs";

import { HTTP_API } from '@app/app-settings';

import { UserService } from "./user.service";
import { LocalStorageService } from "./local-storage.service";

import { User } from "../models/user.model";
import { PlayerResults } from "../models/player-results.model";



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
    public readonly playerResultsList$: BehaviorSubject<PlayerResults[]>
        = new BehaviorSubject(this._playerResultsList);


    constructor(
        private http: HttpClient,
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
            this._setPlayerResultsList(await this._fetchLatestPlayerResults());
        });
    }


    ///////////////////////////////////////////////////////////////////////////.
    // API Calls :

    /**
     * @returns A promise resolving to an array of the 5 latest player results
     * corresponding to the selected user.
     */
    private async _fetchLatestPlayerResults(): Promise<PlayerResults[]> {
        // API call - GET :
        return firstValueFrom(this.http.get<PlayerResults[]>(
            `${HTTP_API}/player-results/${this.user.userId}?limit=5`
        ));
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
}
