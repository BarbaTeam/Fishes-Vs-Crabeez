import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LobbyInfo } from '@app/shared/models/lobby-info.model';
import { User } from '@app/shared/models/user.model';
import { SocketService } from '@app/shared/services/socket.service';

@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrls: ['./game-lobby-page.component.scss']
})
export class GameLobbyPageComponent implements OnDestroy {
    public lobbyId: number = 0;
    public players: User[] = [];
    private subscriptions = new Subscription();

    constructor(private socket: SocketService) {
        this.initSocket();
    }

    private initSocket(): void {

        this.subscriptions.add(this.socket.on<any>('lobbyCreated').subscribe((lobbyId) => {
            if(this.lobbyId != 0) return;
            this.lobbyId = lobbyId;
            console.log('[LOBBY] Received new lobbyId:', lobbyId);
        }));

        this.subscriptions.add(this.socket.on<User[]>('lobbyState').subscribe(players => {
            this.players = players;
            console.log('[LOBBY] Received full lobby state:', players);
        }));

        this.subscriptions.add(this.socket.on<any>('playerConnected').subscribe(({lobbyId, player}) => {
            if(!this.lobbyId == lobbyId) return;
            const exists = this.players.some(p => p.userId === player.userId);
            if (!exists) {
                this.players.push(player);
                console.log('[LOBBY] Player connected:', player);
            }
        }));

        this.subscriptions.add(this.socket.on<any>('playerDisconnected').subscribe(({lobbyId, player}) => {
            if(!this.lobbyId == lobbyId) return;
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
        this.socket.sendMessage('closeLobby', this.lobbyId); 
        this.subscriptions.unsubscribe();            
        console.log('[LOBBY] Component destroyed, lobby closed.');
    }
}
