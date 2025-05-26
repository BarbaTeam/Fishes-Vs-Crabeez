import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@app/shared/models/user.model';
import { LobbyInfo } from '@app/shared/models/lobby-info.model';
import { SocketService } from '@app/shared/services/socket.service';

@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrls: ['./game-lobby-page.component.scss']
})
export class GameLobbyPageComponent implements OnDestroy {
    public roomId: string = '';
    public players: User[] = [];

    private subscriptions = new Subscription();

    constructor(private socket: SocketService) {
        this.initSocket();
    }

    private initSocket(): void {
        this.subscriptions.add(
            this.socket.on<string>('lobbyCreated').subscribe(newRoomId => {
                if (!this.roomId) {
                    this.roomId = newRoomId;
                    this.socket.sendMessage('requestLobbyState', this.roomId);
                }
            })
        );

        this.subscriptions.add(
            this.socket.on<LobbyInfo>('lobbyState').subscribe(({ lobbyId, players }) => {
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

        this.socket.onReady(() => {
            this.socket.sendMessage('createLobby', {});
        });
    }

    public startGame(): void {
        this.socket.sendMessage('ergoStartGame', { roomId: this.roomId });
    }

    ngOnDestroy(): void {
        if (this.roomId) {
            this.socket.sendMessage('closeLobby', this.roomId);
        }
        this.subscriptions.unsubscribe();
    }
}
