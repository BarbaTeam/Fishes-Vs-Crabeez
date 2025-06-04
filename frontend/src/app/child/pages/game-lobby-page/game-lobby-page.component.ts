import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesLobbyService } from '@app/shared/services/games-lobby.service';

import { GameLobby } from '@app/shared/models/game-lobby.model';



@Component({
    selector: 'app-game-lobby-page',
    templateUrl: './game-lobby-page.component.html',
    styleUrl: './game-lobby-page.component.scss'
})
export class GameLobbyPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public waitingGame!: GameLobby;
    public inCountdown: boolean = false;

    constructor(
        private socket: SocketService,
        private gameLobbiesService:GamesLobbyService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.queryParams
            .pipe(first()) // <-- one time subscription
            .subscribe(params => {
                this.subscriptions.add(
                    this.gameLobbiesService.getGameLobbyById$(params['id']).subscribe(
                        gameLobby => this.waitingGame = gameLobby!
                    )
                );
            });

        this.subscriptions.add(
            this.socket.on<any>('gameClosed').subscribe(() => {
                this.router.navigate(['child/games-list']);
            })
        );

        this.subscriptions.add(
            this.socket.on<any>('leaveGame').subscribe(() => {
                this.router.navigate(['child/games-list']);
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('startCountdown').subscribe(() => {
                this.startCountdown();
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('endCountdown').subscribe(() => {
                this.router.navigate(['child/game'], { queryParams: { id: this.waitingGame.gameId } });
            })
        );
    }

    public countdown: number = 5;
    private startCountdown(): void {
        this.inCountdown = true;

        this.countdown = 5;
        const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown < 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.socket.sendMessage('leaveGame');
    }
}
