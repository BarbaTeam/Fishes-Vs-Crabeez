import { Component, Input, OnInit } from '@angular/core';

import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model'
import { UserID } from '../../models/ids';



type ConnectionState = "Connected"|"Disconnected";



@Component({
    selector: 'app-stateful-user-card',
    templateUrl: './stateful-user-card.component.html',
    styleUrls: ['./stateful-user-card.component.scss'],
    host: {
        '[class.connected]': 'state === "Connected"',
        '[class.disconnected]': 'state === "Disconnected"'
    }
})
export class StatefulUserCardComponent implements OnInit {
    @Input()
    user!: User;

    @Input()
    userId?: UserID;

    @Input()
    state!: ConnectionState;

    firstName = '';
    lastName = '';

    constructor(
        private socket: SocketService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if (this.userId) {
            this.user = this.userService.getUserById(this.userId)!;
        }
    }

    public disconnectUser(): void {
        this.socket.sendMessage('forceDisconnection', this.user.userId);
    }
}