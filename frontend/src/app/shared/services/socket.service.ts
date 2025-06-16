import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { User } from '@app/shared/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private _currentUser?: User;

    constructor(
        private socket: Socket
    ) {}

    setCurrentUser(user: User): void {
        this._currentUser = user;
    }

    getCurrentUser(): User | undefined {
        return this._currentUser;
    }

    sendMessage(type: string, data?: any): void {
        this.socket.emit(type, data);
    }

    on<T = any>(type: string): Observable<T> {
        return this.socket.fromEvent<T>(type);
    }

    get id() {
        return this.socket.ioSocket.id;
    }

    onReady(callback: () => void): void {
        if (this.socket.ioSocket.connected) {
            callback();
        } else {
            this.socket.ioSocket.once('connect', callback);
        }
    }

    
    connect(token?: string): void {
        if (this.socket.ioSocket.connected) {
            console.log('[DEBUG :: SocketService] Already connected');
            return;
        }

        console.log(`[DEBUG :: SocketService] Connecting${token ? ' with token: ' + token : ' as new client'}`);
        
        if (token) {
            this.socket.ioSocket.auth = { token };
        }

        this.socket.connect();
    }

    
    disconnect(): void {
        if (this.socket.ioSocket.connected) {
            console.log('[DEBUG :: SocketService] Disconnecting from server');
            this.socket.disconnect();
        }
    }

    
    get connected(): boolean {
        return this.socket.ioSocket.connected;
    }

   
    emit(event: string, data?: any): void {
        this.sendMessage(event, data);
    }
}