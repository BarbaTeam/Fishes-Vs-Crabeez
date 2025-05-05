import { Component } from '@angular/core';

import { UserService } from 'src/app/shared/services/user.service';

import { User } from 'src/app/shared/models/user.model';



@Component({
    selector: 'app-child-lobby-game',
    templateUrl: './child-lobby-game.component.html',
    styleUrl: './child-lobby-game.component.scss'
})
export class ChildLobbyGameComponent {
    public user!: User;

    constructor(
        private userService: UserService
    ) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        })
    }
}
