import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
    constructor(private socket: Socket) {}

    sendMessage(type: string, data: any): void {
        this.socket.emit(type, data);
    }

    on<T = any>(type: string): Observable<T> {
        return this.socket.fromEvent<T>(type);
    }

    onReady(callback: () => void): void {
        if (this.socket.ioSocket.connected) {
            callback();
        } else {
            this.socket.ioSocket.on('connect', callback);
        }
    }

    connect(): void {
        if (!this.socket.ioSocket.connected) {
            this.socket.connect();
        }
    }

    disconnect(): void {
        this.socket.disconnect();
    }
}
