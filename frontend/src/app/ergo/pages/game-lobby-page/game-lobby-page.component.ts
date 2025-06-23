import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesLobbyService } from '@app/shared/services/games-lobby.service';

import { GameLobby, GameLobbyState } from '@app/shared/models/game-lobby.model';



@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrls: ['./game-lobby-page.component.scss']
})
export class GameLobbyPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public gameLobby!: GameLobby;


    constructor(
        private socket: SocketService,
        private gamesLobbyService: GamesLobbyService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.gamesLobbyService.selectedGameLobby$.subscribe(
                (gameLobby) => { this.gameLobby = gameLobby; }
            )
        );
    }

    public get inRunningGame(): boolean {
        return this.gameLobby.state === GameLobbyState.RUNNING;
    }

    public get inWaitingGame(): boolean {
        return this.gameLobby.state === GameLobbyState.WAITING;
    }


    public startGame(): void {
        this.socket.sendMessage('startGame');
    }

    ngOnDestroy(): void {
        this.socket.sendMessage('closeGame');
        this.subscriptions.unsubscribe();
    }

    public onGameConfigUpdate(): void {
        // ...
    }

    public onGameLobbyUpdate(): void {
        // ...
    }
}
