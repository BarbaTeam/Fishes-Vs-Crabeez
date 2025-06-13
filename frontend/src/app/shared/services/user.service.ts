import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { from } from "rxjs";

import { HTTP_API } from '@app/app-settings';

import { LocalStorageService } from "./local-storage.service";

import { User } from "../models/user.model";
import { UserID } from "../models/ids";
import { SocketService } from "./socket.service";



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
        lastName: "Nom",
        firstName: "Prénom",
        age: 0,
        icon: "unknown.png",
        config: {
            advancedStats: false,
            leaderBoard: false,

            fontSize: 0.5,
            sound: 0.5,

            showsAnswer: false,
            readingAssistance: false,

            notionsMask: {
                REWRITING: false,
                ADDITION: false,
                SUBSTRACTION: false,
                MULTIPLICATION: false,
                DIVISION: false,
                EQUATION: false,
                ENCRYPTION: false,
            },
        },
    };


    constructor(
        private http: HttpClient,
        private localStorageService : LocalStorageService,
        private socket: SocketService
    ) {
        // Users :
        from(this._fetchUsers()).subscribe((users) => {
            this._users = users;
            this.users$.next(users);
        });


        // Selected User :
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
    // API Calls :

    private async _fetchUsers(): Promise<User[]> {
        return firstValueFrom(this.http.get<User[]>(
            `${HTTP_API}/users`
        ));
    }

    private async _createUser(userData: Omit<User, "userId">): Promise<User> {
        return firstValueFrom(this.http.post<User>(
            `${HTTP_API}/users/`, userData
        ));
    }

    // TODO : Add support for sending `Partial<User>` as update
    private async _updateUserById(userId: UserID, updatedUser: User): Promise<User> {
        return firstValueFrom(this.http.put<User>(
            `${HTTP_API}/users/${userId}`, updatedUser
        ));
    }

    private async _removeUserById(userId: UserID): Promise<void> {
        return firstValueFrom(this.http.delete<void>(
            `${HTTP_API}/users/${userId}`
        ));
    }


    ///////////////////////////////////////////////////////////////////////////.
    // Actions :

    public selectUser(userId: UserID){
        this._selectedUser = this._users.find(user => user.userId == userId)!;
        if (this._selectedUser) {
            this.selectedUser$.next(this._selectedUser);
            this.localStorageService.saveData(
                UserService.LocalStorageKey.SELECTED_USER,
                JSON.stringify(this._selectedUser)
            );
            this.socket.setCurrentUser(this._selectedUser);
        }
    }

    public async createUser(userData: Omit<User, "userId">): Promise<void> {
        try {
            const user = await this._createUser(userData);
            // On Success :
            this._users.push(user);
            this.users$.next(this._users);
        } catch (err) {
            // On Failure :
            if (err instanceof HttpErrorResponse) {
                switch (err.status) {
                    case 500 :
                        console.warn("Error occured on server");
                        break;

                    case 0: case 502: case 504:
                        console.warn("Request timeout");
                        break;

                    default :
                        throw new Error(`Unexpected Error: ${err}`);
                }
            } else {
                throw new Error(`Unexpected Error: ${err}`);
            }
        }
    }


    public async saveChanges(changedUser: User): Promise<void> {
        if (!changedUser) {
            return;
        }

        try {
            const updatedUser = await this._updateUserById(
                changedUser.userId, changedUser
            );
            // On Success :
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
        } catch (err) {
            // On Failure :
            if (err instanceof HttpErrorResponse) {
                switch (err.status) {
                    case 404 :
                        console.warn("User not found");
                        break;

                    case 500 :
                        console.warn("Error occured on server");
                        break;

                    case 0: case 502: case 504:
                        console.warn("Request timeout");
                        break;

                    default :
                        throw new Error(`Unexpected Error: ${err}`);
                }
            } else {
                throw new Error(`Unexpected Error: ${err}`);
            }
        }
    }

    public async removeUserById(userId: UserID) {
        try {
            await this._removeUserById(userId);
            // On Success :
            const userIndex = this._users.findIndex(u => u.userId === userId);
            if (userIndex !== -1) {
                this._users.splice(userIndex, 1);
                this.users$.next(this._users);
                this.localStorageService.removeData(
                    UserService.LocalStorageKey.SELECTED_USER
                );
            } else {
                console.warn(`User \"${userId}\" not found`);
            }
        } catch (err) {
            // On Failure :
            if (err instanceof HttpErrorResponse) {
                switch (err.status) {
                    case 404 :
                        console.warn("User not found");
                        break;

                    case 500 :
                        console.warn("Error occured on server");
                        break;

                    case 0: case 502: case 504:
                        console.warn("Request timeout");
                        break;

                    default :
                        throw new Error(`Unexpected Error: ${err}`);
                }
            } else {
                throw new Error(`Unexpected Error: ${err}`);
            }
        }
    }

    public getUserById(userId: UserID): User | undefined {
        return this._users.find(user => user.userId == userId);
    }
}