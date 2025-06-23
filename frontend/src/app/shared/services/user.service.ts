import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService{
    private users: User[] = [];
    public users$: BehaviorSubject<User[]> = new BehaviorSubject(this.users);

    constructor() {
        this.loadUsers();
    }

    //plus tard on utilisera les requêtes https
    private loadUsers(): void {
        this.users = [
            { name: "Eli KOPTER", age: "9", icon: "../../assets/images/child-pps/red_fish.png"},
            { name: "patrick KOPTER", age: "9", icon: "../../assets/images/child-pps/yellow_fish.png"},
            { name: "lohann KOPTER", age: "9", icon: "../../assets/images/child-pps/blue_fish.png"},
            { name: "juste KOPTER", age: "9", icon: "../../assets/images/child-pps/turtle.png"}

        ]
        this.users$.next(this.users);
    }
    
}