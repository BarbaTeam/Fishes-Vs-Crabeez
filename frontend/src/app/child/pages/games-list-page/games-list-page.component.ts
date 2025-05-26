import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '@app/shared/models/user.model';
import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '@app/shared/services/user.service';

@Component({
    selector: 'app-games-list-page',
    templateUrl: './games-list-page.component.html',
    styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent implements OnDestroy {
    public players: User[] = [];
    public roomId: string = '';

    private subscriptions = new Subscription();
    private user!: User;
    private userReady = false;
    private roomReady = false;

    constructor(
        private socket: SocketService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(user => {
                this.user = user;
                this.userReady = true;
                this.tryInitSocket();
            })
        );

        this.subscriptions.add(
            this.route.queryParams.subscribe(params => {
                this.roomId = params['id'];
                this.roomReady = true;
                this.tryInitSocket();
            })
        );
    }

    private tryInitSocket(): void {
        if (this.userReady && this.roomReady) {
            this.initSocket();
        }
    }

    private initSocket(): void {
        this.subscriptions.add(
            this.socket.on<any>('lobbyState').subscribe(({ lobbyId, players }) => {
                if (lobbyId === this.roomId) {
                    this.players = players;
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerConnected').subscribe(({ lobbyId, player }) => {
                if (lobbyId === this.roomId && !this.players.some(p => p.userId === player.userId)) {
                    this.players.push(player);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerDisconnected').subscribe(({ lobbyId, player }) => {
                if (lobbyId === this.roomId) {
                    this.players = this.players.filter(p => p.userId !== player.userId);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('lobbyClosed').subscribe(closedRoomId => {
                if (closedRoomId === this.roomId) {
                    this.router.navigate(['child/joining-games']);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('leaveLobby').subscribe(() => {
                this.router.navigate(['child/joining-games']);
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('gameStarted').subscribe(startedRoomId => {
                if (startedRoomId === this.roomId) {
                    this.router.navigate(['child/game']);
                }
            })
        );

        this.socket.onReady(() => {
            this.socket.sendMessage('joinLobby', {
                lobbyId: this.roomId,
                player: this.user
            });

            this.socket.sendMessage('requestLobbyState', this.roomId);
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();

        this.socket.sendMessage('leaveLobby', {
            lobbyId: this.roomId,
            player: this.user
        });
    }
}
