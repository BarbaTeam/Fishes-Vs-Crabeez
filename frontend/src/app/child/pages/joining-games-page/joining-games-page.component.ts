import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/shared/services/user.service';
import { User } from '@app/shared/models/user.model';
import { LobbyInfo } from '@app/shared/models/lobby-info.model';
import { SocketService } from '@app/shared/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-joining-games-page',
    templateUrl: './joining-games-page.component.html',
    styleUrl: './joining-games-page.component.scss'
})
export class JoiningGamesPageComponent implements OnInit, OnDestroy {
    user!: User;
    lobbies: LobbyInfo[] = [];
    private subscriptions = new Subscription();

    constructor(
        private userService: UserService,
        private router: Router,
        private socket: SocketService
    ) {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(user => this.user = user)
        );
    }

    ngOnInit(): void {
        this.initSocket();

        this.socket.onReady(() => {
            this.socket.sendMessage('requestLobbies', {});
        });
    }

    private initSocket(): void {
        this.subscriptions.add(
            this.socket.on<string>('lobbyCreated').subscribe((roomId) => {
                const exists = this.lobbies.some(l => l.lobbyId === roomId);
                if (!exists) {
                    this.lobbies.push({ lobbyId: roomId, players: [] });
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('lobbyClosed').subscribe((roomId) => {
                this.lobbies = this.lobbies.filter(l => l.lobbyId !== roomId);
                this.socket.sendMessage('requestLobbies', {});
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerConnected').subscribe(({ lobbyId, player }) => {
                const lobby = this.lobbies.find(l => l.lobbyId === lobbyId);
                if (lobby && !lobby.players.some(p => p.userId === player.userId)) {
                    lobby.players.push(player);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerDisconnected').subscribe(({ lobbyId, player }) => {
                const lobby = this.lobbies.find(l => l.lobbyId === lobbyId);
                if (lobby) {
                    lobby.players = lobby.players.filter(p => p.userId !== player.userId);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<string[]>('lobbies').subscribe((lobbyIds) => {
                this.lobbies = lobbyIds.map(id => {
                    const existing = this.lobbies.find(l => l.lobbyId === id);
                    return { lobbyId: id, players: existing?.players ?? [] };
                });
            })
        );

        this.subscriptions.add(
            this.socket.on<LobbyInfo[]>('lobbiesUpdated').subscribe((updates) => {
                this.lobbies = updates.map(update => ({
                    lobbyId: update.lobbyId,
                    players: Array.isArray(update.players) ? update.players : []
                }));
            })
        );
    }

    joinLobby(roomId: string): void {
        this.router.navigate(['/child/games-list'], { queryParams: { id: roomId } });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
