import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@app/shared/models/user.model';
import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '@app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-games-list-page',
    templateUrl: './games-list-page.component.html',
    styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent implements OnDestroy {
    public players: User[] = [];
    public lobbyId: number = 0;
    private subscriptions = new Subscription();
    private user!: User;

    constructor(
        private socket: SocketService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe((user: User) => {
                this.user = user;
                this.initSocket();
            })
        );
        this.route.queryParams.subscribe(params => {
            this.lobbyId = Number(params['id']);
        });
    }

    private initSocket(): void {
        this.subscriptions.add(this.socket.on<any>('lobbyState').subscribe(({lobbyId, players}) => {
            if(lobbyId != this.lobbyId) return;
            console.log('Lobby state received:', players);
            this.players = players;
        }));

        this.subscriptions.add(this.socket.on<any>('playerConnected').subscribe(({lobbyId, player}) => {
            if(lobbyId != this.lobbyId) return;
            const exists = this.players.some(p => p.userId === player.userId);
            if (!exists) {
                this.players.push(player);
                console.log('Player added to lobby:', player);
            }
        }));

        this.subscriptions.add(this.socket.on<any>('playerDisconnected').subscribe(({lobbyId, player}) => {
            if(lobbyId != this.lobbyId) return;
            this.players = this.players.filter(p => p.userId !== player.userId);
            console.log('Player removed from lobby:', player);
        }));

        this.subscriptions.add(this.socket.on<number>('lobbyClosed').subscribe(lobbyId => {
            if(lobbyId != this.lobbyId) return;
            console.warn('Lobby has been closed by the host.');
            this.router.navigate(['child/joining-games']);
        }));

        this.subscriptions.add(this.socket.on<number>('gameStarted').subscribe(lobbyId => {
            if(lobbyId != this.lobbyId) return;
            this.router.navigate(['child/game']);
        }))

        this.socket.onReady(() => {
            this.socket.sendMessage('playerConnected', {lobbyId : this.lobbyId, user : this.user});
            this.socket.sendMessage('requestLobbyState', this.lobbyId);
        });
    }

    ngOnDestroy(): void {
        this.socket.sendMessage('playerDisconnected', {lobbyId : this.lobbyId, user : this.user});
        this.subscriptions.unsubscribe();
    }
}
