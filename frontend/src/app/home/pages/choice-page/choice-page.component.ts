import { Component } from '@angular/core';

import { SocketService } from '@app/shared/services/socket.service';


@Component({
    selector: 'app-choice-page',
    templateUrl: './choice-page.component.html',
    styleUrl: './choice-page.component.scss'
})
export class ChoicePageComponent {
    constructor(
        private socket: SocketService
    ) {}

    public onConnectAsErgo() {
        // TODO : Make true verif
        this.socket.sendMessage('tryConnectAsErgo');
    }
}
