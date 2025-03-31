import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-child-play-page',
  templateUrl: './child-play-page.component.html',
  styleUrl: './child-play-page.component.scss'
})
export class ChildPlayPageComponent {
    
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
