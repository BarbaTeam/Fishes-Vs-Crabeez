import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-new-child-page',
    templateUrl: './new-child-page.component.html',
    styleUrl: './new-child-page.component.scss'
})
export class NewChildPageComponent {
    public userBlank: User;

    private  _userTemp!: User;

    public isValid : Boolean = false;

    constructor(
        private userService: UserService,
        private router: Router
    ) {
        this.userBlank = userService.EMPTY_USER;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Handler :

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

    public back(): void {
        this.router.navigate(['/ergo/childs-list']);
    }

    public createUser(): void {
        if (this._userTemp && this.isValid) {
            this.userService.createUser(this._userTemp);
            this.back();
        }
    }
}
