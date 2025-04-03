import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject, Observable } from "rxjs";
import { LocalStorageService } from "./localStorage.service";

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
        this.users = [
            { userId:"1", name: "Eli KOPTER", age: "9", icon: "red_fish.png"},
            { userId:"2", name: "patrick KOPTER", age: "9", icon: "yellow_fish.png"},
            { userId:"3", name: "lohann KOPTER", age: "9", icon: "blue_fish.png"},
            { userId:"4", name: "juste KOPTER", age: "9", icon: "turtle.png"}

        ]
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