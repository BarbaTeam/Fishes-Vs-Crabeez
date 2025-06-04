import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from './shared/services/socket.service';



@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(
        private socket: SocketService
    ) {}

    ngOnInit(){
        this.socket.connect();
    }

    ngOnDestroy(){
        this.socket.disconnect();
    }
}
