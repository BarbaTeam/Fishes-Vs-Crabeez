import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';
import { QuestionNotion } from '@app/shared/models/question.model';



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

        const containsValidFirstName = this._userTemp.firstName.length > 0;
        const containsValidLastName = this._userTemp.lastName.length > 0;
        const containsValidAge = this._userTemp.age > 0;
        const activatesAtLeastOneNotion =  Object.entries(
            this._userTemp.config.notionsMask
        ).some(([k, n]) => {
            return n && k !== QuestionNotion.ENCRYPTION;
        });

        this.isValid = (
            containsValidFirstName
            && containsValidLastName
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
