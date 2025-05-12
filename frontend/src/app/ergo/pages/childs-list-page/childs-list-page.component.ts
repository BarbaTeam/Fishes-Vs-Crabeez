import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';
import { UserID } from '@app/shared/models/ids';



@Component({
    selector: 'childs-list-page',
    templateUrl: './childs-list-page.component.html',
    styleUrl: './childs-list-page.component.scss'
})
export class ChildsListPageComponent {
    public userBlank: User;

    public users!: User[];

    constructor(
        private userService: UserService,
        private router: Router,
    ) {
        this.userBlank = this.userService.EMPTY_USER;

        this.userService.users$.subscribe((users: User[]) => {
            this.users = users;
        });
    }

    onUserClick(userId: UserID) {
        this.userService.selectUser(userId);
        this.router.navigate(['/ergo/child-stats']);
    }

    public addNewUser(): void {
        this.router.navigate(['/ergo/new-child']);
    }
}
