import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LocalStorageService } from "./localStorage.service";

import { User } from "../models/user.model";
import { MOCK_USER } from "../mocks/user.mock";

@Injectable({
    providedIn: 'root'
})

/**
 * Remarques & Interrogations:
 *      Confirmer la bonne utilisation de BehaviorSubject, plûtot que Observable
 */
export class UserService{
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
}