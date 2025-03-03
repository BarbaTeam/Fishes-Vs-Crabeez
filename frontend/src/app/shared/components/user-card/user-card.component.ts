import { Component } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="icon">
        <ng-content select=".icon" />
    </div>
    <div class="name">
      <ng-content select=".name"/>
    </div>
  `,
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

}
