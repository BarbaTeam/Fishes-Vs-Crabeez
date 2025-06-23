import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, from, of } from "rxjs";

import { HTTP_API } from '@app/app-settings';

import { UserService } from "./user.service";

import { User } from "../models/user.model";
import { PlayerStatistics } from "../models/player-results.model";



@Injectable({
    providedIn: 'root'
})
export class PlayerStatisticsService {
    // Internal State :
    private user!: User;


    // Public Observables :
    public get playerStatistics$(): Observable<PlayerStatistics|null> {
        if (!this.user) {
            return of(null);
        }
        return from(this._fetchPlayerStatistics())
    }


    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });
    }


    ///////////////////////////////////////////////////////////////////////////.
    // API Calls :

    /**
     * @returns A promise resolving to the player's statistics.
     */
    private async _fetchPlayerStatistics(): Promise<PlayerStatistics> {
        return firstValueFrom(this.http.get<PlayerStatistics>(
            `${HTTP_API}/player-statistics/${this.user.userId}`
        ));
    }
}
