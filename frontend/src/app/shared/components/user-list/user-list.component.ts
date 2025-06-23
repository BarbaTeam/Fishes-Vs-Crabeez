import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent {
    public userList: User[] = [];

    constructor(private userService: UserService,  private router: Router){
        this.userService.users$.subscribe((users: User[]) => {
            this.userList = users;
        });
    }

    ngOnInit(): void {}

    selectUser(userId:User['userId']): void {
        this.userService.selectUser(userId);
        this.router.navigate(['/child-play']);
    }
}

