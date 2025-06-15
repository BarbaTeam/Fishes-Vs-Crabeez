import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesService } from '@app/shared/services/games.service';

import { Game, GameState } from '@app/shared/models/game.model';



@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrls: ['./game-lobby-page.component.scss']
})
export class GameLobbyPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public game!: Game;


    constructor(
        private socket: SocketService,
        private gamesService: GamesService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.gamesService.selectedGame$.subscribe(
                (game) => { this.game = game; }
            )
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

    ngOnDestroy(): void {
        this.socket.sendMessage('closeGame');
        this.subscriptions.unsubscribe();
    }

    public onGameUpdate(): void {
        this.socket.sendMessage(
            'updateGame', this.game
        );
    }
}
