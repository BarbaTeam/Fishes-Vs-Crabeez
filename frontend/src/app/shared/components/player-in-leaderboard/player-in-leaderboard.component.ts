import { Component, OnInit, OnDestroy,  Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model'
import { UserID } from '../../models/ids';
import { Grade, Grading } from '@app/shared/models/results.model';



@Component({
    selector: 'app-player-in-leaderboard',
    templateUrl: './player-in-leaderboard.component.html',
    styleUrl: './player-in-leaderboard.component.scss'
})
export class PlayerInLeaderboardComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();

    @Input()
    user!: User;

    @Input()
    userId?: UserID;

    @Input()
    grading!: Grading;

    public firstName!: string;
    public lastName!: string;

    private _isUnrolled: boolean = false;

    constructor(
        private userService: UserService
    ) {}


    ngOnInit(): void {
        if (this.userId) {
            this.subscriptions.add(
                this.userService.getUserById$(this.userId).subscribe(
                    user => { if (user) this.user = user; }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    public isUnrolled(): boolean {
        return this._isUnrolled;
    }


    public toogle(): void {
        this._isUnrolled = !this._isUnrolled;
    }

    public get gradeIcon(): string {
        const ICON_PATH = "../../../../assets/images/icons/grading";

        switch (this.grading.grade) {
            case Grade.S : return ICON_PATH + "/S_icon.png";
            case Grade.A : return ICON_PATH + "/A_icon.png";
            case Grade.B : return ICON_PATH + "/B_icon.png";
            case Grade.C : return ICON_PATH + "/C_icon.png";
            case Grade.D : return ICON_PATH + "/D_icon.png";
            case Grade.E : return ICON_PATH + "/E_icon.png";
            case Grade.F : return ICON_PATH + "/F_icon.png";
            case Grade.XF: return ICON_PATH + "/nograde.png";
            default: throw new Error("Should never happen");
        }
    }
}
