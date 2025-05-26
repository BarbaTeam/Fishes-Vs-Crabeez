import { Component } from '@angular/core';

import { NotifService } from '@app/shared/services/notif.service';

import { Notif } from '@app/shared/models/notif.model';




@Component({
    selector: 'app-notif-container',
    templateUrl: './notif-container.component.html',
    styleUrls: ['./notif-container.component.scss']
})
export class NotifContainerComponent {
    public notif: Notif|null = null;

    constructor(
        private notifService: NotifService,
    ) {
        this.notifService.notif$.subscribe(notif => {
            if (notif !== null) this.notif = notif;
            setTimeout(() => this.notif = null, 3500); // Hide the notif after 3.5s
        });
    }

    public close(): void  {
        this.notif = null;
    }
}
