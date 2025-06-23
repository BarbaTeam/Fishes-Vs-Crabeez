import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
export class StatefulUserCardComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();

    @Input()
    user!: User;

    @Input()
    userId?: UserID;

    @Input()
    state!: ConnectionState;

    constructor(
        private socket: SocketService,
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
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public disconnectUser(event : Event): void {
        event.stopPropagation();
        this.socket.sendMessage('tryForceDisconnection', this.user.userId);
    }
}