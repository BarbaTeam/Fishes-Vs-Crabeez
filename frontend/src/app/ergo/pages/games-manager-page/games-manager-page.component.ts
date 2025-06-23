import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';
import { GamesLobbyService } from '@app/shared/services/games-lobby.service';
import { GameID } from '@app/shared/models/ids';



@Component({
    selector: 'app-games-manager-page',
    templateUrl: './games-manager-page.component.html',
    styleUrl: './games-manager-page.component.scss'
})
export class GamesManagerPageComponent {
    constructor(
        private socket: SocketService,
        private gamesLobbyService: GamesLobbyService,
        private router: Router,
    ) {}

    public openGame() {
        this.socket.on<GameID>('openGame_SUCCESS')
            .pipe(first()) // <-- one time subscription
            .subscribe((gameId) => {
                this.gamesLobbyService.selectGameLobby(gameId);
                this.router.navigateByUrl('/ergo/game-lobby');
            });

        this.socket.sendMessage('openGame');
    }
}
