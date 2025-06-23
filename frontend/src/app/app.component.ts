import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from './shared/services/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


    constructor(
        private socket: SocketService
    ){
    }

    ngOnInit(){
        this.initSocket();
    }

    private initSocket(): void {
        this.socket.connect();
    }

    ngOnDestroy(){
        this.socket.disconnect();
    }    
}

