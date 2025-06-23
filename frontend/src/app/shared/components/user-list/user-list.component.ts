import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service'

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

