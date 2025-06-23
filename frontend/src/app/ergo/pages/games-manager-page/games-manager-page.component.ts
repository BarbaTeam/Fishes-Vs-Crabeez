import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, Subscription } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesService } from '@app/shared/services/games.service';

import { GameID } from '@app/shared/models/ids';
import { Game, GameLobby, GameState } from '@app/shared/models/game.model';



@Component({
    selector: 'app-games-manager-page',
    templateUrl: './games-manager-page.component.html',
    styleUrl: './games-manager-page.component.scss'
})
export class GamesManagerPageComponent implements OnInit, OnDestroy {

    public subscriptions = new Subscription();
    public waitingGames: Game[] = [];
    public runningGames : Game[] = [];
    
    constructor(
        private socket: SocketService,
        private gamesService: GamesService,
        private router: Router,
    ) {}
    

    ngOnInit(){
        this.subscriptions.add(
            this.gamesService.gamesPerStates$.subscribe(gamePerStates => {
                this.waitingGames = gamePerStates[GameState.WAITING];
                this.runningGames = gamePerStates[GameState.RUNNING];
            })
        );
    }

    public spyGame(gameId: GameID): void {
        this.socket.on<string>('trySpyGame_SUCCESS')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                this.router.navigate(['/ergo/game-lobby'], { queryParams: { id: gameId } });
            });

        this.socket.on<string>('trySpyGame_FAILURE')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                console.log("failed to spy game");
            });

        this.socket.sendMessage('trySpyGame', gameId);
    }

    public openGame() {
        this.socket.on<GameID>('openGame_SUCCESS')
            .pipe(first()) // <-- one time subscription
            .subscribe((gameId) => {
                this.gamesService.selectGame(gameId);
                this.router.navigateByUrl('/ergo/game-lobby');
            });

        this.socket.sendMessage('openGame');
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
