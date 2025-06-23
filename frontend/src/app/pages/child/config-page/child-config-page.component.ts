import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-child-config-page',
  templateUrl: './child-config-page.component.html',
  styleUrl: './child-config-page.component.scss'
})
export class ChildConfigPageComponent {

    user!: User;

    constructor(private userService: UserService) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        })
    }

    ngOnInit() {
        console.log(this.user);
    }   
}
