import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '@app/shared/services/user.service';
import { NotifService } from '@app/shared/services/notif.service';

import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-child-config-page',
    templateUrl: './child-config-page.component.html',
    styleUrls: ['./child-config-page.component.scss']
})
export class ChildConfigPageComponent implements OnInit {
    private subsriptions: Subscription = new Subscription();

    user!: User;
    private _userTemp!: User;

    showSuccess = false;
    showDeleted = false;

    public isValid : Boolean = false;

    constructor(
        private userService: UserService,
        private router: Router,
        private notifService: NotifService,
    ) {}


    ////////////////////////////////////////////////////////////////////////////
    // Handler :

    ngOnInit(): void {
        this.subsriptions.add(
            this.userService.selectedUser$.subscribe((user: User) => {
                this.user = user;
            })
        );
    }

    private _validateUserForm(): void {
        if (!this._userTemp) {
            this.isValid = false;
        }

        const containsValidFirstName = this._userTemp.firstName.length > 0;
        const containsValidLastName = this._userTemp.lastName.length > 0;
        const containsValidAge = this._userTemp.age > 0;
        const activatesAtLeastOneNotion =  Object.values(
            this._userTemp.config.notionsMask
        ).some(n => n);

        this.isValid = (
            containsValidFirstName
            && containsValidLastName
            && containsValidAge
            && activatesAtLeastOneNotion
        );
    }

    public onUserTempChanged(updatedUser: User): void {
        this._userTemp = updatedUser;
        this._validateUserForm();
    }

    ngOnDestroy() {
        this.notifService.forceCloseNotif();

        this.subsriptions.unsubscribe();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    async saveChanges(): Promise<void> {
        if (this._userTemp && this.isValid) {
            await this.userService.saveChanges(this._userTemp);
            this.notifService.triggerNotif(
                "Success", "Configuration mise à jour"
            );
        }
    }

    back(): void {
        this.router.navigate(['/ergo/childs-list']);
    }

    removeSafety(): void {
        this.showDeleted = true;
    }
    putSafety(): void {
        this.showDeleted = false;
    }

    async removeUser(): Promise<void> {
        if(!this.showDeleted) return;
        await this.userService.removeUserById(this.user.userId);
        this.back();
    }
}
