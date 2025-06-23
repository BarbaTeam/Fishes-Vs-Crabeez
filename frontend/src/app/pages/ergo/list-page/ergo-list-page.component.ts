import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'ergo-list-page',
  templateUrl: './ergo-list-page.component.html',
  styleUrl: './ergo-list-page.component.scss'
})

export class ErgoListPageComponent {

    public userBlank: User;
      
    constructor(private userService: UserService, private router: Router) {
        this.userBlank = userService.EMPTY_USER;
    }
    
    public addNewUser(): void {
        this.router.navigate(['/ergo-config-form']);
    }

}
