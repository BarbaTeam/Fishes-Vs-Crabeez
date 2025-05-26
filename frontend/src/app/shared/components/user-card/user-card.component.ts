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

    
    firstName: string = '';
    lastName: string = '';

    constructor(
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if (this.userId) {
            this.user = this.userService.getUserById(this.userId)!;
        }
        this.splitName();
    }

    
    private splitName(): void {
        if (!this.user?.name) return;

        const parts = this.user.name.trim().split(' ');
        if (parts.length === 1) {
            this.firstName = parts[0];
            this.lastName = '';
        } else {
            this.firstName = parts.slice(0, -1).join(' ');
            this.lastName = parts[parts.length - 1];
        }
    }
}
