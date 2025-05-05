import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model'
import { UserID } from '../../models/ids';



@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

    @Input()
    user!: User;

    @Input()
    userId?: UserID

    constructor(
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if (this.userId) {
            this.user = this.userService.getUser(this.userId)!;
        }
    }
}
