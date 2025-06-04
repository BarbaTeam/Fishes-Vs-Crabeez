import { Component, Input } from '@angular/core';

import { GameLobby, GameLobbyState } from '@app/shared/models/game-lobby.model';



@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
    @Input()
    gameLobby!: GameLobby;

    get state_fr(): string {
        switch (this.gameLobby.state) {
            case GameLobbyState.RUNNING : return "En cours";
            case GameLobbyState.WAITING : return "En attente";
        }
    }
}
