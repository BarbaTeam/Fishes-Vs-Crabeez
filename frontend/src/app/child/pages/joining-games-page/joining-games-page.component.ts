import { Component } from '@angular/core';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-joining-games-page',
    templateUrl: './joining-games-page.component.html',
    styleUrl: './joining-games-page.component.scss'
})
export class JoiningGamesPageComponent {
    user!: User;

    constructor(
        private userService: UserService
    ) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        })
    }
}
