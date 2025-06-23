import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

/**
 * Remarques & Interrogations:
 *      Confirmer la bonne utilisation de BehaviorSubject, plûtot que Observable
 *      Lorsqu'on définie selectedUser, je mets undefined car this.users.find (dans la méthode selectUser) est de type "User | undefined"
 *      DEFAULT_USER sert de "sécurité" car behaviorSubject ne peut pas être undefined... d'où le changement potentiel avec Observable ??
*/     
export class UserService{
    private users: User[] = [];
    public users$: BehaviorSubject<User[]> = new BehaviorSubject(this.users);

    private DEFAULT_USER : User = {
        userId: "",
        name: "",
        age: "",
        icon: ""
    }
    private selectedUser!: User | undefined; 
    public selectedUser$: BehaviorSubject<User> = new BehaviorSubject(this.selectedUser || this.DEFAULT_USER);

    constructor() {
        this.loadUsers();
        console.log(this.selectedUser);
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
        this.selectedUser = this.users.find(user => user.userId == userId);
        if(this.selectedUser){
            this.selectedUser$.next(this.selectedUser);
        }
    }
    
}