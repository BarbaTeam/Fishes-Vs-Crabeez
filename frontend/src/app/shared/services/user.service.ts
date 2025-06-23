import { Injectable } from "@angular/core";
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { from } from "rxjs";

import { LocalStorageService } from "./local-storage.service";

import { User } from "../models/user.model";
import { MOCK_USER } from "../mocks/user.mock";
import { UserID } from "../models/ids";



@Injectable({
    providedIn: 'root'
})
export class UserService{
    // Local Storage Keys :
    private static readonly LocalStorageKey = {
        SELECTED_USER: "selectedUser"
    } as const;


    // Internal State :
    private _users: User[] = [] as User[];
    private _selectedUser: User = {} as User;


    // Public Observables :
    public users$: BehaviorSubject<User[]>
        = new BehaviorSubject(this._users);
    public selectedUser$: BehaviorSubject<User>
        = new BehaviorSubject(this._selectedUser);


    public EMPTY_USER: User = {
        userId:`u${Math.floor(Math.random() * 1000)}`,
        name: "",
        age: 0,
        icon: "unknown.png",
        userConfig: {
            showsAnswer: false,
            readingAssistance: false,
            advancedStats: false,
            leaderBoard: false,
            fontSize: 0.5,
            sound: 0.5,
            numberRewrite: false,
            addition: false,
            soustraction: false,
            multiplication: false,
            division: false,
            encryption: false,
            equation: false,
        }
    };


    constructor(
        // private http: HttpClient,
        private localStorageService : LocalStorageService,
    ) {
        from(this._fetchUsers()).subscribe(
            users => {
                this._users = users;
                this.users$.next(users)
            }
        )

        const saved = this.localStorageService.getData(
            UserService.LocalStorageKey.SELECTED_USER
        );
        if (saved !== null) {
            try {
                this._selectedUser = JSON.parse(saved);
            } catch (err) {
                if (err !instanceof SyntaxError) throw err;
            }
        }
        this.selectedUser$.next(this._selectedUser);
    }


    ///////////////////////////////////////////////////////////////////////////.
    // Utils :

    private async _fetchUsers(): Promise<User[]> {
        // TODO : Replacing usage of local mocks w/ HTTP requests
        const ret: User[] = MOCK_USER;

        // NOTE : Asynchrone to ease the transition to an implementation using API call (see return stmt below)
        return Promise.resolve(ret);
        // return this.http.get<User[]>(
        //     `/api/users/list`
        // ).toPromise();
    }


    public selectUser(userId: User['userId']){
        this._selectedUser = this._users.find(user => user.userId == userId)!;
        if(this._selectedUser){
            this.selectedUser$.next(this._selectedUser);
            this.localStorageService.saveData(
                UserService.LocalStorageKey.SELECTED_USER,
                JSON.stringify(this._selectedUser)
            );
        }
    }

    public createUser(user: User) {
        this._users.push(user);
        this.users$.next(this._users);
    }

    public removeUser(user: User) {
        const userIdx = this._users.findIndex(u => u.userId === user.userId);
        if (userIdx !== -1) {
            this._users.splice(userIdx, 1);
            this.users$.next(this._users);
            this.localStorageService.removeData(UserService.LocalStorageKey.SELECTED_USER);
        } else {
            console.warn(`User ${user.userId} not found`);
        }
    }

    public saveChanges(changedUser: User): void {
        if (changedUser) {
            const userIdx = this._users.findIndex(
                user => user.userId === changedUser.userId
            );

            if (userIdx === -1) {
                console.warn(`User ${changedUser.userId} not found`);
                return;
            }

            this._users[userIdx] = { ...changedUser };

            if (this._selectedUser.userId === changedUser.userId) {
                this._selectedUser = { ...changedUser };
                this.selectedUser$.next(this._selectedUser);
                this.localStorageService.saveData(
                    UserService.LocalStorageKey.SELECTED_USER,
                    JSON.stringify(this._selectedUser)
                );
            }

            this.users$.next(this._users);
        }
    }

    public getUser(userId: UserID): User | undefined {
        return this._users.find(user => user.userId == userId);
    }
}