import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '@app/shared/services/socket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-child-host',
  template: `<router-outlet></router-outlet>`,
})
export class ChildHostComponent implements OnInit, OnDestroy{
    private subscriptions = new Subscription();

    constructor(
        private socket : SocketService,
        private router : Router,
    ){}

    ngOnInit(): void {
        this.subscriptions.add(
            this.socket.on<void>('goBackHome').subscribe(()=>{
                this.router.navigate(['/home']);
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}