import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  @Input() gameId!: string;
  @Input() playerCount!: number;
  @Input() gameState!: string;

  getStatusClass(state: string): string {
    return 'status-' + state.replace(/\s+/g, '-').toLowerCase();
  }
}
