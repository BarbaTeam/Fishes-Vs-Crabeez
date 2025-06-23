import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '@app/shared/services/user.service';
import { GamesLobbyService } from '@app/shared/services/games-lobby.service';

import { GameID } from '@app/shared/models/ids';
import { GameLobby, GameLobbyState  } from '@app/shared/models/game-lobby.model';
import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-games-list-page',
    templateUrl: './games-list-page.component.html',
    styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    public user!: User;
    public waitingGames: GameLobby[] = [];
    public selected: 'solo' | 'multi' | null = null;

    constructor(
        private socket: SocketService,
        private userService: UserService,
        private gamesLobbyService: GamesLobbyService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(user => this.user = user)
        );

        this.subscriptions.add(
            this.gamesLobbyService.gamesLobbyPerStates$.subscribe(gameLobbiesPerStates => {
                // NOTE : Might be changed to support display of running games
                this.waitingGames = gameLobbiesPerStates[GameLobbyState.WAITING];
            })
        );
    }

    public joinGame(gameId: GameID): void {
        this.socket.on<string>('tryJoinGame_SUCCESS')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                this.router.navigate(['/child/game-lobby'], { queryParams: { id: gameId } });
            });

        this.socket.on<string>('tryJoinGame_FAILURE')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                // TODO : Show notification
            });

        this.socket.sendMessage('tryJoinGame', gameId);
    }
    public onExpand(mode: 'solo' | 'multi') {
        this.selected = mode;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
