import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service'
import { ChildListPageComponent } from 'src/app/pages/child/list-page/child-list-page.component';
import { ErgoConfigPageComponent } from 'src/app/pages/ergo/config-page/ergo-config-page.component';
import { ErgoStatPageComponent } from 'src/app/pages/ergo/stat-page/ergo-stat-page.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent {
    public userList: User[] = [];

    constructor(private userService: UserService,  private router: Router, private route: ActivatedRoute){
        this.userService.users$.subscribe((users: User[]) => {
            this.userList = users;
        });
    }

    ngOnInit(): void {
        console.log(this.route);
    }

    selectUser(userId:User['userId']): void {
        this.userService.selectUser(userId);
        if(this.route.component!.name == "ChildListPageComponent")
            this.router.navigate(['/child-play']);
        if(this.route.component!.name == "ErgoConfigPageComponent")
            this.router.navigate(['/ergo-config-selected']);
        if(this.route.component!.name == "ErgoStatPageComponent")
            this.router.navigate(['/ergo-stat-selected']);
        
    }
}

