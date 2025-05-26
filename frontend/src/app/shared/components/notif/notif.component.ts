import { Component, Input, Output, EventEmitter } from '@angular/core';



const NotifKind = {
    SUCCESS: "Success",
    WARNING: "Warning",
    ERROR: "Error",
} as const;
type NotifKind = typeof NotifKind[keyof typeof NotifKind];



@Component({
    selector: 'app-notif',
    templateUrl: './notif.component.html',
    styleUrls: ['./notif.component.scss']
})
export class NotifComponent {
    @Input()
    kind!: NotifKind;

    @Input()
    content!: string;

    @Output()
    closed = new EventEmitter<Boolean>();

    public close(): void {
        this.closed.emit(true);
    }
}
