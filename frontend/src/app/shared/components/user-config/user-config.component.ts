import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

    @Input() user!: User;

    @Output() userTemp = new EventEmitter<User>();

    localUserTemp!: User;
    currentUrl: string = '';

    constructor(private router: Router) {
        this.router.events.subscribe(() => {
          this.currentUrl = this.router.url;
        });
    }

    ngOnInit(): void {
        this.localUserTemp = {
          ...this.user,
          userConfig: { ...this.user.userConfig }
        };

        this.userTemp.emit(this.localUserTemp);
    }

    showIconSelector = false;

    availableIcons = [
        'blue_fish.png',
        'red_fish.png',
        'yellow_fish.png',
        'turtle.png'
    ];

    selectIcon(icon: string) {
        this.localUserTemp.icon = icon;
        this.showIconSelector = false;
        this.onChange();
    }

    onChange(): void {
        this.userTemp.emit(this.localUserTemp);
    }
}

