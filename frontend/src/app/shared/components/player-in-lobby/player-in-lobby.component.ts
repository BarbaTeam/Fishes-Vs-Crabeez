import { Component, OnInit, Input } from '@angular/core';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model'
import { UserID } from '../../models/ids';



@Component({
    selector: 'app-player-in-lobby',
    templateUrl: './player-in-lobby.component.html',
    styleUrl: './player-in-lobby.component.scss'
})
export class PlayerInLobbyComponent implements OnInit {

    @Input()
    user!: User;

    @Input()
    userId?: UserID;

    private _isUnrolled: boolean = false;

    constructor(private userService: UserService) {}


    ngOnInit(): void {
        if (this.userId) {
            this.user = this.userService.getUser(this.userId)!;
        }
    }


    public isUnrolled(): boolean {
        return this._isUnrolled;
    }


    public toogle(): void {
        this._isUnrolled = !this._isUnrolled;
    }
}
