import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/shared/services/user.service';
import { User } from '@app/shared/models/user.model';
import { GameInfo } from '@app/shared/models/game-info.model';
import { SocketService } from '@app/shared/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-joining-games-page',
    templateUrl: './joining-games-page.component.html',
    styleUrl: './joining-games-page.component.scss'
})
export class JoiningGamesPageComponent implements OnInit, OnDestroy {
    user!: User;
    games: GameInfo[] = [];
    private subscriptions = new Subscription();

    constructor(
        private userService: UserService,
        private router: Router,
        private socket: SocketService
    ) {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(user => this.user = user)
        );
    }

    ngOnInit(): void {
        this.initSocket();

        this.socket.onReady(() => {
            this.socket.sendMessage('requestGames', {});
        });
    }

    private initSocket(): void {
        this.subscriptions.add(
            this.socket.on<GameInfo>('gameCreated').subscribe(({gameId, players, state}) => {
                this.games.push({ gameId: gameId, players: players, state: state });
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('gameClosed').subscribe((roomId) => {
                this.games = this.games.filter(l => l.gameId !== roomId);
                this.socket.sendMessage('requestLobbies', {});
            })
        );

        this.subscriptions.add(
            this.socket.on<GameInfo[]>('gamesUpdated').subscribe((updates) => {
                this.games = updates.map(update => ({
                    gameId: update.gameId,
                    players: Array.isArray(update.players) ? update.players : [],
                    state: update.state
                }));
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('accessGranted').subscribe((gameId) => {
                this.router.navigate(['/child/games-list'], { queryParams: { id: gameId } });
            })
        );

        this.subscriptions.add(
            this.socket.on<string>('accessDenied').subscribe(() => {
            })
        );
    }

    joinGame(gameId: string): void {
        this.socket.sendMessage('askAccessToGame', { gameId: gameId});
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
