import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-child-config-page',
    templateUrl: './child-config-page.component.html',
    styleUrls: ['./child-config-page.component.scss']
})
export class ChildConfigPageComponent implements OnInit {

    user!: User;
    private _userTemp!: User;

    showSuccess = false;
    showDeleted = false;

    public isValid : Boolean = false;

    constructor(
        private userService: UserService,
        private router: Router
    ) {}


    ////////////////////////////////////////////////////////////////////////////
    // Handler :

    ngOnInit(): void {
        this.userService.selectedUser$.subscribe((user: User) => {
          this.user = user;
        });
    }

    private _validateUserForm(): void {
        if (!this._userTemp) {
            this.isValid = false;
        }

        const containsValidName = this._userTemp.name.trim().length > 0;
        const containsValidAge = this._userTemp.age > 0;
        const activatesAtLeastOneNotion = [
            this._userTemp.userConfig.numberRewrite,
            this._userTemp.userConfig.addition,
            this._userTemp.userConfig.soustraction,
            this._userTemp.userConfig.multiplication,
            this._userTemp.userConfig.division,
            this._userTemp.userConfig.encryption,
            this._userTemp.userConfig.equation,
        ].some(n => n);

        this.isValid = (
            containsValidName
            && containsValidAge
            && activatesAtLeastOneNotion
        );
    }

    onUserTempChanged(updatedUser: User): void {
        this._userTemp = updatedUser;
        this._validateUserForm();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    saveChanges(): void {
        if (this._userTemp && this.isValid) {
            this.userService.saveChanges(this._userTemp);
            this.showSuccess = true;
            setTimeout(() => {
                this.showSuccess = false;
            }, 2000);
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
    removeUser(): void {
        this.userService.removeUser(this._userTemp);
        this.back();
    }
}
