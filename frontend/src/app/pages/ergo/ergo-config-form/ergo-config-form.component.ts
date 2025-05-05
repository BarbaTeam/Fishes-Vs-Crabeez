import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { assert } from 'src/utils';



@Component({
    selector: 'app-ergo-config-form',
    templateUrl: './ergo-config-form.component.html',
    styleUrl: './ergo-config-form.component.scss'
})
export class ErgoConfigFormComponent {
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

    public createUser(): void {
        if (this._userTemp && this.isValid) {
            this.userService.createUser(this._userTemp);
            this.router.navigate(['/ergo-list']);
        }
    }

    public back(): void {
        this.router.navigate(['/ergo-list']);
    }
}
