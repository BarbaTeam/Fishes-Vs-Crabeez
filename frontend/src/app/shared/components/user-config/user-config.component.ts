import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { isInErgoPage } from '@app/utils/component-inspect';



@Component({
    selector: 'app-user-config',
    templateUrl: './user-config.component.html',
    styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
    public readonly availableIcons = [
        'blue_fish.png',
        'red_fish.png',
        'yellow_fish.png',
        'turtle.png',
    ];

    @Input()
	user!: User;

    @Output()
	userTemp = new EventEmitter<User>();

    public localUserTemp!: User;

    public isInErgoPage: boolean = false;
    public showIconSelector: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.isInErgoPage = isInErgoPage(route, router);
    }

    ngOnInit(): void {
        this.localUserTemp = {
            ...this.user,
            config: { ...this.user.config }
        };

        this.userTemp.emit(this.localUserTemp);
    }

    onChange(): void {
        this.userTemp.emit(this.localUserTemp);
    }

    selectIcon(icon: string) {
        this.localUserTemp.icon = icon;
        this.showIconSelector = false;
        this.onChange();
    }
}

