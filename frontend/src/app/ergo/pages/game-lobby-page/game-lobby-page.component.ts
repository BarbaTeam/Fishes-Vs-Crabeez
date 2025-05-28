import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@app/shared/models/user.model';
import { SocketService } from '@app/shared/services/socket.service';

@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrls: ['./game-lobby-page.component.scss']
})
export class GameLobbyPageComponent implements OnDestroy {
    public gameId: string = '';
    public state: string = '';
    public players: User[] = [];

    private subscriptions = new Subscription();

    constructor(private socket: SocketService) {
        this.initSocket();
    }

    private initSocket(): void {
        this.subscriptions.add(
            this.socket.on<any>('gameCreated').subscribe(({gameId, state}) => {
                this.gameId = gameId;
                this.state = state;
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('gameState').subscribe(({ players, state }) => {
                this.players = players;
                this.state = state;
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerConnected').subscribe( player => {
                this.players.push(player);
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('playerDisconnected').subscribe(player => {
                this.players = this.players.filter(p => p.userId !== player.userId);
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('gameStarted').subscribe(() => {
                this.state = 'En cours de jeu';
            })
        );

        this.socket.onReady(() => {
            this.socket.sendMessage('createGame', {});
        });
    }

    public startGame(): void {
        this.socket.sendMessage('prepareStartGame');
    }

    ngOnDestroy(): void {
        if (this.gameId) {
            this.socket.sendMessage('closeGame', this.gameId);
        }
        this.subscriptions.unsubscribe();
    }
}
