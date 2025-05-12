import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
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
