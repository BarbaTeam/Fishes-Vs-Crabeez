import { Component } from '@angular/core';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-games-list-page',
    templateUrl: './games-list-page.component.html',
    styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent {
    public user!: User;

    constructor(
        private userService: UserService
    ) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        })
    }
}
