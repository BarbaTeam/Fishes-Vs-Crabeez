import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@app/shared/models/user.model';
import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '@app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-games-list-page',
    templateUrl: './games-list-page.component.html',
    styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent implements OnDestroy {
    public players: User[] = [];
    private subscriptions = new Subscription();
    private user!: User;

    constructor(
        private socket: SocketService,
        private userService: UserService,
        private router: Router
    ) {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe((user: User) => {
                this.user = user;
                this.initSocket();
            })
        );
    }

    private initSocket(): void {
        this.socket.connect();

        this.subscriptions.add(this.socket.on<User[]>('lobbyState').subscribe(players => {
            console.log('Lobby state received:', players);
            this.players = players;
        }));

        this.subscriptions.add(this.socket.on<User>('playerConnected').subscribe(player => {
            const exists = this.players.some(p => p.userId === player.userId);
            if (!exists) {
                this.players.push(player);
                console.log('Player added to lobby:', player);
            }
        }));

        this.subscriptions.add(this.socket.on<User>('playerDisconnected').subscribe(player => {
            this.players = this.players.filter(p => p.userId !== player.userId);
            console.log('Player removed from lobby:', player);
        }));

        this.subscriptions.add(this.socket.on<void>('lobbyClosed').subscribe(() => {
            console.warn('Lobby has been closed by the host.');
            this.router.navigate(['child/joining-games']);
        }));

        this.socket.onReady(() => {
            this.socket.sendMessage('playerConnected', this.user);
            this.socket.sendMessage('requestLobbyState', {});
        });
    }

    ngOnDestroy(): void {
        this.socket.sendMessage('playerDisconnected', this.user);
        this.socket.disconnect();
        this.subscriptions.unsubscribe();
    }
}
