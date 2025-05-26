import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lobby-card',
  templateUrl: './lobby-card.component.html',
  styleUrl: './lobby-card.component.scss'
})
export class LobbyCardComponent {
  @Input() lobbyId!: string;
  @Input() playerCount!: number;
}
