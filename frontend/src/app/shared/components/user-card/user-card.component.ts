import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model'

@Component({
  selector: 'app-user-card',
  template: `
    <div class="icon">
        <img src="{{user?.icon}}" alt="icone de {{user?.name}}">
    </div>
    <div class="name">
        {{user?.name}}
    </div>
  `,
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

  @Input()
  user!: User;

  constructor() {}

  ngOnInit(): void {
    console.log(this.user)
  }
}
