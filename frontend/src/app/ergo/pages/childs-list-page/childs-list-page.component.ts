import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '@app/shared/services/user.service';

import { User } from '@app/shared/models/user.model';
import { UserID } from '@app/shared/models/ids';



type ConnectionState = "Connected"|"Disconnected";



@Component({
    selector: 'childs-list-page',
    templateUrl: './childs-list-page.component.html',
    styleUrl: './childs-list-page.component.scss'
})
export class ChildsListPageComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();

    private _connectedUsersId: UserID[] = [];
    private _disconnectedUsersId: UserID[] = [];

    public users: User[] = [];
    public usersState: ConnectionState[] = [];


    constructor(
        private socket: SocketService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this._startup();

        this.subscriptions.add(
            this.socket.on<UserID>('userConnected').subscribe((userId) => {
                this._connectedUsersId.push(userId);
                this._disconnectedUsersId.splice(this._disconnectedUsersId.indexOf(userId), 1);

                this._updateUsers();
            })
        );

        this.subscriptions.add(
            this.socket.on<UserID>('userDisconnected').subscribe((userId) => {
                this._connectedUsersId.splice(this._connectedUsersId.indexOf(userId), 1);
                this._disconnectedUsersId.push(userId);

                this._updateUsers();
            })
        );
    }


    private _startup(): void {
        // Before having true list
        this.subscriptions.add(
            this.userService.users$.subscribe(users => {
                this._disconnectedUsersId = users.map(u => u.userId);

                this._updateUsers();
            })
        );


        this.socket.onReady(() => {
            this.socket.sendMessage('requestConnectedUsersId', {});
            this.socket.sendMessage('requestDisconnectedUsersId', {});
        });

        this.socket.on<UserID[]>('connectedUsersId')
            .pipe(first()) // <-- one time subscription
            .subscribe(connectedUsersId => {
                this._connectedUsersId = connectedUsersId;
                this._disconnectedUsersId = this._disconnectedUsersId.filter(
                    userId => !connectedUsersId.includes(userId)
                );

                this._updateUsers();
            });

        this.socket.on<UserID[]>('disconnectedUsersId')
            .pipe(first()) // <-- one time subscription
            .subscribe(disconnectedUsersId => {
                this._connectedUsersId = this._connectedUsersId.filter(
                    userId => !disconnectedUsersId.includes(userId)
                );
                this._disconnectedUsersId = disconnectedUsersId;

                this._updateUsers();
            });
    }


    private _updateUsers(): void {
        this.users = [
            ...this._connectedUsersId,
            ...this._disconnectedUsersId,
        ].map(userId => this.userService.getUserById(userId)!);

        this.usersState = [
            ...this._connectedUsersId.map(_ => "Connected"),
            ...this._disconnectedUsersId.map(_ => "Disconnected"),
        ] as ConnectionState[];
    }


    public onUserClick(userId: UserID) {
        this.userService.selectUser(userId);
        this.router.navigate(['/ergo/child-stats']);
    }

    public addNewUser(): void {
        this.router.navigate(['/ergo/new-child']);
    }
}