import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { SocketService } from '@app/shared/services/socket.service';
import { UserService } from '@app/shared/services/user.service';
import { GamesService } from '@app/shared/services/games.service';
import { NotifService } from '@app/shared/services/notif.service';

import { GameID } from '@app/shared/models/ids';
import { Game, GameLobby, GameState } from '@app/shared/models/game.model';
import { User } from '@app/shared/models/user.model';



@Component({
    selector: 'app-games-list-page',
    templateUrl: './games-list-page.component.html',
    styleUrl: './games-list-page.component.scss'
})
export class GamesListPageComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    public user!: User;
    public waitingGames: Game[] = [];
    public runningGames : Game[] = [];

    showSettings = false;
    showRules = false;
    showIconSelector: boolean = false;

    public userTemp!: User;

    get settings() {
        return {
            fontSize: this.userTemp?.config?.fontSize,
            volume: this.userTemp?.config?.sound
        };
    }

    public readonly availableIcons = [
        'blue_fish.png',
        'red_fish.png',
        'yellow_fish.png',
        'turtle.png',
    ];

    constructor(
        private socket: SocketService,
        private userService: UserService,
        private gamesService: GamesService,
        private router: Router,
        private notifService: NotifService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.userService.selectedUser$.subscribe(user => {
                this.user = user;
                this.userTemp = {
                    ...this.user,
                    config: { ...this.user.config }
                };
            })
        );

        this.subscriptions.add(
            this.gamesService.gamesPerStates$.subscribe(gamePerStates => {
                this.waitingGames = gamePerStates[GameState.WAITING];
                this.runningGames = gamePerStates[GameState.RUNNING];
            })
        );
    }

    public joinGame(gameId: GameID): void {
        this.socket.on<string>('tryJoinGame_SUCCESS')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                this.router.navigate(['/child/game/'], { queryParams: { id: gameId } });
            });

        this.socket.on<string>('tryJoinGame_FAILURE')
            .pipe(first()) // <-- one time subscription
            .subscribe(() => {
                // TODO : Show notification
            });

        this.socket.sendMessage('tryJoinGame', gameId);
    }

    openSettings(): void {
        this.userTemp = {
            ...this.user,
            config: { ...this.user.config }
        };
        this.showSettings = true;
    }

    closeSettings(event?: Event): void {
        if (event && event.target === event.currentTarget) {
            this.userTemp = {
                ...this.user,
                config: { ...this.user.config }
            };
        }
        this.showSettings = false;
    }

    updateFontSize(fontSize: number): void {
        if (this.userTemp && this.userTemp.config) {
            this.userTemp.config.fontSize = fontSize;
        }
    }

    updateVolume(volume: number): void {
        if (this.userTemp && this.userTemp.config) {
            this.userTemp.config.sound = volume;
        }
    }

    selectIcon(icon: string) {
        this.userTemp.icon = icon;
        this.showIconSelector = false;
    }

    async saveSettings(): Promise<void> {
        if (!this.userTemp) {
            return;
        }

        try {
            await this.userService.saveChanges(this.userTemp);

            this.notifService.triggerNotif(
                "Success", "Paramètres mis à jour"
            );

            this.showSettings = false;
        } catch (error) {
            this.notifService.triggerNotif(
                "Error", "Erreur lors de la sauvegarde"
            );
            console.error('Erreur lors de la sauvegarde des paramètres:', error);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}