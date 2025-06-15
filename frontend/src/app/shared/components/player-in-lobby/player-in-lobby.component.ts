import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '../../services/user.service';

import { User } from '../../models/user.model'
import { UserID } from '../../models/ids';
import { QuestionNotion } from '@app/shared/models/question.model';



@Component({
    selector: 'app-player-in-lobby',
    templateUrl: './player-in-lobby.component.html',
    styleUrl: './player-in-lobby.component.scss'
})
export class PlayerInLobbyComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();

    @Input()
    user!: User;

    @Input()
    userId?: UserID;

    @Input()
    notionsMask!: Record<QuestionNotion, boolean>;

    @Output()
    maskChanged = new EventEmitter();

    private _isUnrolled: boolean = false;

    constructor(
        private userService: UserService
    ) {
        this.userService.users$.subscribe(
            users => console.log(users)
        );
    }

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

    public onMaskChanged(): void {
        this.maskChanged.emit();
    }
}
