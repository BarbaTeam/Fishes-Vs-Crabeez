import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';



@Component({
    selector: 'app-ergo-config-selected-page',
    templateUrl: './ergo-config-selected-page.component.html',
    styleUrls: ['./ergo-config-selected-page.component.scss']
})
export class ErgoConfigSelectedPageComponent implements OnInit {

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

        // DEBUG ::
        console.log("At Least One Notion :");
        console.log(activatesAtLeastOneNotion);

        console.log([
            this._userTemp.userConfig.numberRewrite,
            this._userTemp.userConfig.addition,
            this._userTemp.userConfig.soustraction,
            this._userTemp.userConfig.multiplication,
            this._userTemp.userConfig.division,
            this._userTemp.userConfig.encryption,
            this._userTemp.userConfig.equation,
        ]);

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
        this.router.navigate(['/ergo-list']);
    }

    removeSafety(): void {
        this.showDeleted = true;
    }
    putSafety(): void {
        this.showDeleted = false;
    }
    removeUser(): void {
        this.userService.removeUser(this._userTemp);
        this.router.navigate(['/ergo-list']);
    }
}
