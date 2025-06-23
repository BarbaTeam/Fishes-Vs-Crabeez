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

    public saveChanges(changedUser: User): void {
        if (changedUser) {
          const index = this.users.findIndex(user => user.userId === changedUser.userId);
      
          if (index !== -1) {
            this.users[index] = { ...changedUser }; //c'est un spread operator, ca sert à faire une copie de changedUser et pas utilisé directement l'instance passé en paramètre, une bonne pratique angular askip
            
            if (this.selectedUser.userId === changedUser.userId) {
              this.selectedUser = { ...changedUser }; 
              this.selectedUser$.next(this.selectedUser); 
              this.localStorageService.saveData(this.LOCAL_STORAGE_KEY, JSON.stringify(this.selectedUser));
          }

            this.users$.next(this.users);
            console.log(`User ${changedUser.userId} mis à jour.`);
          } else {
            console.warn(`User ${changedUser.userId} non trouvé dans la liste.`);
          }
        }
      }
}