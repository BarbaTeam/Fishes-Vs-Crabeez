import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent {
    public userList: User[] = [];

    constructor(private userService: UserService){
      this.userService.users$.subscribe((users: User[]) => {
        this.userList = users;
      });
    }

    ngOnInit(): void {}
}

