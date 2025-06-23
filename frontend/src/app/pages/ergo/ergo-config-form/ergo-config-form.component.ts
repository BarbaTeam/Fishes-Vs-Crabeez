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
    user!: User;


    constructor(private userService: UserService, private router: Router) { }

  
    createUser(): void {
        this.userService.createUser(this.user);
        this.router.navigate(['/ergo-list']);
    }

    back(): void {
        this.router.navigate(['/ergo-list']);
    }
}
