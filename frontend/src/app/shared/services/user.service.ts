import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { from } from "rxjs";

import { LocalStorageService } from "./localStorage.service";

import { User } from "../models/user.model";
import { MOCK_USER } from "../mocks/user.mock";
import { UserID } from "../models/ids";

@Injectable({
    providedIn: 'root'
})

/**
 * Remarques & Interrogations:
 *      Confirmer la bonne utilisation de BehaviorSubject, plûtot que Observable
 */
export class UserService{
    public EMPTY_USER: User = {
        userId:`u${Math.floor(Math.random() * 1000)}`,
        name: "New Player",
        age: "",
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

    private users: User[] = [];
    public users$: BehaviorSubject<User[]> = new BehaviorSubject(this.users);

    private LOCAL_STORAGE_KEY = "selectedUser"
    private selectedUser!: User;
    public selectedUser$: BehaviorSubject<User> = new BehaviorSubject(this.selectedUser);

    constructor(private localStorageService : LocalStorageService) {
        this.selectedUser = JSON.parse(localStorageService.getData(this.LOCAL_STORAGE_KEY)!) as User;
        this.selectedUser$.next(this.selectedUser);

        this.loadUsers();
    }

    //plus tard on utilisera les requêtes https
    private loadUsers(): void {
        this.users = MOCK_USER;
        this.users$.next(this.users);
    }

    public selectUser(userId: User['userId']){
        this.selectedUser = this.users.find(user => user.userId == userId)!;
        if(this.selectedUser){
            this.selectedUser$.next(this.selectedUser);
            this.localStorageService.saveData(this.LOCAL_STORAGE_KEY, JSON.stringify(this.selectedUser));
        }
    }

    public createUser(user: User) {
        this.users.push(user);
        this.users$.next(this.users);
    }
    
    public removeUser(user: User) {
        const userIdx = this.users.findIndex(u => u.userId === user.userId);
        if (userIdx !== -1) {
            this.users.splice(userIdx, 1);
            this.users$.next(this.users);
            this.localStorageService.removeData(this.LOCAL_STORAGE_KEY);
        } else {
            console.warn(`User ${user.userId} not found`);
        }
    }
    
    public saveChanges(changedUser: User): void {
        if (changedUser) {
            const userIdx = this.users.findIndex(
                user => user.userId === changedUser.userId
            );

            if (userIdx === -1) {
                console.warn(`User ${changedUser.userId} not found`);
                return;
            }

            this.users[userIdx] = { ...changedUser };

            if (this.selectedUser.userId === changedUser.userId) {
                this.selectedUser = { ...changedUser };
                this.selectedUser$.next(this.selectedUser);
                this.localStorageService.saveData(this.LOCAL_STORAGE_KEY, JSON.stringify(this.selectedUser));
            }

            this.users$.next(this.users);
        }
    }

    public getUser(userId: UserID): User | undefined {
        return this.users.find(user => user.userId == userId);
    }
}