import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesService } from '@app/shared/services/games.service';

import { Game } from '@app/shared/models/game.model';



@Component({
    selector: 'app-game-waiting-page',
    templateUrl: './game-waiting-page.component.html',
    styleUrl: './game-waiting-page.component.scss'
})
export class GameWaitingPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public waitingGame!: Game;
    public inCountdown: boolean = false;

    constructor(
        private socket: SocketService,
        private gamesService: GamesService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.queryParams
            .pipe(first()) // <-- one time subscription
            .subscribe(params => {
                this.subscriptions.add(
                    this.gamesService.getGameById$(params['id']).subscribe(
                        game => this.waitingGame = game!
                    )
                );
            });

        this.subscriptions.add(
            this.socket.on<any>('forcedGameLeave').subscribe(() => {
                this.router.navigate(['/child']);
            })
        );

        // TODO : Moving countdown management in a guard

        this.subscriptions.add(
            this.socket.on<void>('startCountdown').subscribe(() => {
                this.startCountdown();
            })
        );

        this.subscriptions.add(
            this.socket.on<void>('endCountdown').subscribe(() => {
                this.router.navigate(['/child/game/running'], { queryParams: { id: this.waitingGame.gameId } });
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
    }
}
