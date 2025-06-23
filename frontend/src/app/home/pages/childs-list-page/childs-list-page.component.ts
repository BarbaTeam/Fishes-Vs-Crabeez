import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    public users!: User[];
    public filteredUsers: User[] = [];
    private subscriptions: Subscription = new Subscription();
    private selectedUserIds: UserID[] = [];

    constructor(
        private userService: UserService,
        private router: Router,
        private socket: SocketService,
    ) {}

    ngOnInit(): void {
        this.initSocket();
        this.socket.sendMessage('deselectUser', this.socket.id);

        this.subscriptions.add(
            this.userService.users$.subscribe((users: User[]) => {
                this.users = users;
                this.updateFilteredUsers();
            })
        );

        this.socket.sendMessage('requestSelectedUsersId', {});
    }


    private initSocket(): void {
        this.subscriptions.add(
            this.socket.on<UserID>('userSelectionGranted').subscribe((userId) => {
                this.userService.selectUser(userId);
                this.router.navigate(['/child/joining-games']);
            })
        );

        this.subscriptions.add(
            this.socket.on<UserID>('userSelectionDenied').subscribe((userId) => {
            })
        );

        this.subscriptions.add(
            this.socket.on<UserID[]>('selectedUsersUpdate').subscribe((selectedUserIds: UserID[]) => {
                this.selectedUserIds = selectedUserIds;
                this.updateFilteredUsers();
            })
        );
    }

    private updateFilteredUsers(): void {
        if (this.users) {
            this.filteredUsers = this.users.filter(u => !this.selectedUserIds.includes(u.userId));
        }
    }


    onUserClick(userId: UserID) {
        this.socket.sendMessage('selectUser', userId);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
