import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs';

import { UserService } from '@app/shared/services/user.service';
import { SocketService } from '@app/shared/services/socket.service';

import { User } from '@app/shared/models/user.model';
import { UserID } from '@app/shared/models/ids';



@Component({
    selector: 'app-childs-list-page',
    templateUrl: './childs-list-page.component.html',
    styleUrl: './childs-list-page.component.scss'
})
export class ChildsListPageComponent {
    private subscriptions: Subscription = new Subscription();

    private allUsers!: User[];
    private availableUsersId!: UserID[];

    public get availableUsers(): User[] {
        return this.allUsers.filter(
            u => this.availableUsersId.includes(u.userId)
        );
    }

    constructor(
        private socket: SocketService,
        private userService: UserService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this._startup();

        this.subscriptions.add(
            this.userService.users$.subscribe((users: User[]) => {
                this.allUsers = users;
            })
        );

        this.subscriptions.add(
            this.socket.on<UserID>('userConnected').subscribe((userId) => {
                this.availableUsersId.splice(this.availableUsersId.indexOf(userId), 1);
            })
        );

        this.subscriptions.add(
            this.socket.on<UserID>('userDisconnected').subscribe((userId) => {
                this.availableUsersId.push(userId);
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('tryForceDisconnection_FAILURE').subscribe(() => {
                console.log("Failed to disconnect user...");
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('tryForceDisconnection_SUCCESS').subscribe(() => {
                console.log("User has been disconnected !");
            })
        )
    }

    private _startup(): void {
        this.socket.onReady(() => {
            this.socket.sendMessage('requestAvailableUsersId', {});
        });
        this.socket.on<UserID[]>('availableUsersId')
            .pipe(first()) // <-- one time subscription
            .subscribe((availableUsersId) => {
                this.availableUsersId = availableUsersId;
            });
    }

    public onUserClick(userId: UserID) {
        this.socket.on<string>('tryConnectAsChild_SUCCESS')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                this.userService.selectUser(userId);
                this.router.navigate(['/child']);
            });

        this.socket.on<string>('tryConnectAsChild_FAILURE')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                // TODO : Show notification
            });

        this.socket.sendMessage('tryConnectAsChild', userId);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
