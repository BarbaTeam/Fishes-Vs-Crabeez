import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesService } from '@app/shared/services/games.service';

import { Game, GameState } from '@app/shared/models/game.model';
import { Router } from '@angular/router';



@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrls: ['./game-lobby-page.component.scss']
})
export class GameLobbyPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public game!: Game;
    public hasEnded = false;

    constructor(
        private socket: SocketService,
        private gamesService: GamesService,
        private router : Router
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.gamesService.selectedGame$.subscribe(
                (game) => { this.game = game; }
            )
        );

        this.subscriptions.add(
            this.socket.on<boolean>('gameEnded').subscribe(() => {
                this.hasEnded = true;
            })
        );
    }

    public get inRunningGame(): boolean {
        return this.game.state === GameState.RUNNING;
    }

    public get inWaitingGame(): boolean {
        return this.game.state === GameState.WAITING;
    }


    public startGame(): void {
        this.socket.sendMessage('startGame');
    }
    
    public deleteLobby(): void{
        this.socket.sendMessage('closeGame');
        this.router.navigate(['/ergo/games-manager']);
    }

    ngOnDestroy(): void {
        this.socket.sendMessage('unspyGame')
        this.subscriptions.unsubscribe();
    }

    public onGameUpdate(): void {
        this.socket.sendMessage(
            'updateGame', this.game
        );
    }
}
