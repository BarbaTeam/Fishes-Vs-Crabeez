import { Component, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../../models/user.model';
import { UserID } from '../../models/ids';



type ConnectionState = "Connected"|"Disconnected";



@Component({
    selector: 'app-stateful-users-list',
    templateUrl: './stateful-users-list.component.html',
    styleUrl: './stateful-users-list.component.scss'
})
export class StatefulUsersListComponent {
    @Input()
    users!: User[];

    @Input()
    states!: ConnectionState[];

    @Output()
    userClick = new EventEmitter<UserID>();

    onClick(user: User) {
        this.userClick.emit(user.userId);
    }
}
