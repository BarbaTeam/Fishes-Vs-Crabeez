import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-ergo-config-form',
  templateUrl: './ergo-config-form.component.html',
  styleUrl: './ergo-config-form.component.scss'
})
export class ErgoConfigFormComponent {
    public userBlank: User;
    private  userTemp!: User;

    public isValid : Boolean = false;

    constructor(private userService: UserService, private router: Router) {
        this.userBlank = userService.EMPTY_USER; 
    }

    onUserTempChanged(updatedUser: User): void {
        this.userTemp = updatedUser;
        this.validateUser();
    }

    validateUser(): void {
      const notions = [
        this.userTemp.userConfig.addition,
        this.userTemp.userConfig.soustraction,
        this.userTemp.userConfig.multiplication,
        this.userTemp.userConfig.division,
        this.userTemp.userConfig.encryption,
        this.userTemp.userConfig.equation
      ];
      console.log('Notions:', notions);
      const atLeastOneNotionSelected = notions.some(n => n === true);

      this.isValid =
        !!this.userTemp &&
        this.userTemp.name.trim().length > 0 &&
        this.userTemp.icon !== 'unknown.png' &&
        this.userTemp.age !== '' &&
        !isNaN(Number(this.userTemp.age)) &&
        Number(this.userTemp.age) > 0 &&
        atLeastOneNotionSelected;
    }

    createUser(): void {
        if (this.userTemp && this.isValid) {
            this.userService.createUser(this.userTemp);
            this.router.navigate(['/ergo-list']);
        }
    }

    back(): void {
        this.router.navigate(['/ergo-list']);
    }
}
