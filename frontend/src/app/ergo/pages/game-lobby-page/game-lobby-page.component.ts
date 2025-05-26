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
    public players: User[] = [];
    private subscriptions = new Subscription();

    constructor(private socket: SocketService) {
        this.initSocket();
    }

    private initSocket(): void {
        this.subscriptions.add(this.socket.on<User[]>('lobbyState').subscribe(players => {
            console.log('[LOBBY] Received full lobby state:', players);
            this.players = players;
        }));

        this.subscriptions.add(this.socket.on<User>('playerConnected').subscribe(player => {
            const exists = this.players.some(p => p.userId === player.userId);
            if (!exists) {
                this.players.push(player);
                console.log('[LOBBY] Player connected:', player);
            }
        }));

        this.subscriptions.add(this.socket.on<User>('playerDisconnected').subscribe(player => {
            this.players = this.players.filter(p => p.userId !== player.userId);
            console.log('[LOBBY] Player disconnected:', player);
        }));

        this.socket.sendMessage('createLobby', {}); 
        console.log('[LOBBY] Lobby created (message sent to server)');
    }

    public startGame(){
        this.socket.sendMessage('ergoStartGame', {});
    }

    ngOnDestroy(): void {
        this.socket.sendMessage('destroyLobby', {}); 
        this.subscriptions.unsubscribe();            
        console.log('[LOBBY] Component destroyed, lobby closed.');
    }
}
