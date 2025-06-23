import { Component, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../../models/user.model';
import { UserID } from '../../models/ids';



@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent {
    @Input()
    users!: User[];

    @Output()
    userClick = new EventEmitter<UserID>();
}
