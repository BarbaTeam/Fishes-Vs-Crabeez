import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-choice-button',
  templateUrl: './choice-button.component.html',
  styleUrl: './choice-button.component.scss'
})
export class ChoiceButtonComponent {
  @Input() title: string = 'Titre de la carte';
  @Input() imageUrl: string = '';
  @Input() description: string = 'Description de la carte';
}
