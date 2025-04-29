import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user.model';
import { UserID } from '../../models/ids';
import { UserService } from '../../services/user.service'

import { ChildListPageComponent } from 'src/app/pages/child/list-page/child-list-page.component';
import { ErgoListPageComponent } from 'src/app/pages/ergo/list-page/ergo-list-page.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent implements OnInit {
    public userList: User[] = [];

    constructor(private userService: UserService,  private router: Router, private route: ActivatedRoute){
        this.userService.users$.subscribe((users: User[]) => {
            this.userList = users;
        });
    }

    ngOnInit(): void {
        console.log(this.route);
    }

    selectUser(userId: UserID): void {
        this.userService.selectUser(userId);
        if(this.route.component === ChildListPageComponent)
            this.router.navigate(['/child-play']);
        if(this.route.component === ErgoListPageComponent)
            this.router.navigate(['/ergo-stat-selected']);
    }
}

