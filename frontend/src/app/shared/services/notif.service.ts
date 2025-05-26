import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { Notif, NotifKind } from '../models/notif.model';




/**
 * Service to ease the display of notification.
 */
@Injectable({
    providedIn: 'root'
})
export class NotifService {
    public readonly notif$: BehaviorSubject<Notif|null>
        = new BehaviorSubject<Notif|null>(null);

    constructor() {}

    public triggerNotif(
        kind: NotifKind,
        content: string,
    ): void {
        this.notif$.next({
            kind, content
        });
    }

    public forceCloseNotif(): void {
        this.notif$.next(null);
    }
}