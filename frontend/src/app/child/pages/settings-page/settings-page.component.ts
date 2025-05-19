import { Component } from '@angular/core';

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
    ) {}

    ngOnInit(): void {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });
    }

    public onUserTempChanged(updatedUser: User): void {
        this.userTemp = updatedUser;
    }

    public async saveChanges(): Promise<void> {
        if (this.userTemp) {
            await this.userService.saveChanges(this.userTemp);
        }
    }
}
