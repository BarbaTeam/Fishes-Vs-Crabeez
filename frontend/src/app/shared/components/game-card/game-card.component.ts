import { Component, Input } from '@angular/core';

import { GameLobby, GameState } from '@app/shared/models/game.model';



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
            case GameState.RUNNING : return "En cours";
            case GameState.WAITING : return "En attente";
        }
    }
}
