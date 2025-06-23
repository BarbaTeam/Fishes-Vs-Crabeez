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
    subscriptions = new Subscription();

    constructor(
        private userService: UserService,
        private router: Router,
        private socket: SocketService
    ) {
        this.userService.selectedUser$.subscribe((user: User) => {
            this.user = user;
        });
    }

    ngOnInit(): void {
        this.initSocket();
    }
    
    private initSocket(){
        this.subscriptions.add(
            this.socket.on<any>('lobbyCreated').subscribe((lobbyId)=>{
                const newLobby : LobbyInfo = {lobbyId, players : []};
                this.lobbies.push(newLobby);
            })
        )

        this.subscriptions.add(
            this.socket.on<any>('lobbyClosed').subscribe((lobbyId) => {
                this.lobbies = this.lobbies.filter(lobby => lobby.lobbyId != lobbyId)
            })
        )

        this.subscriptions.add(
            this.socket.on<any>('playerConnected').subscribe(({lobbyId, player}) => {
                this.lobbies.forEach((lobby) => {
                    if(lobby.lobbyId == lobbyId){
                        lobby.players.push(player);
                    }
                })
            })
        )

        this.subscriptions.add(
            this.socket.on<any>('playerDisconnected').subscribe(({lobbyId, player}) => {
                this.lobbies.forEach((lobby) => {
                    if(lobby.lobbyId == lobbyId){
                        lobby.players = lobby.players.filter(p => p.userId != player.userId);
                    }
                })
            })
        )

    }

    joinLobby(lobbyId: number): void {
        this.router.navigate(['/child/games-list'], { queryParams: { id: lobbyId } });
    }
    
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
