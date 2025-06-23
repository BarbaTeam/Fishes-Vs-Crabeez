import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/shared/services/user.service';

import { User } from 'src/app/shared/models/user.model';



@Component({
    selector: 'app-child-config-page',
    templateUrl: './child-config-page.component.html',
    styleUrl: './child-config-page.component.scss'
})
export class ChildConfigPageComponent {
    user!: User;
    userTemp!: User;

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });
    }

    public onUserTempChanged(updatedUser: User): void {
        this.userTemp = updatedUser;
    }

    public saveChanges(): void {
        if (this.userTemp) {
            this.userService.saveChanges(this.userTemp);
        }
    }
}
