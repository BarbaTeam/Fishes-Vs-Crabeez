import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model'
import { UserID } from '../../models/ids';



@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();

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
            this.subscriptions.add(
                this.userService.getUserById$(this.userId).subscribe(
                    user => { if (user) this.user = user; }
                )
            );
        }
        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
