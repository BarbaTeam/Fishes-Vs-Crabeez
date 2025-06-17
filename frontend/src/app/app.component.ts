import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from './shared/services/socket.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
    selector: 'app-root',
    template: `
        <div *ngIf="isReconnecting" class="reconnection-overlay">
            <div class="reconnection-content">
                <div class="spinner"></div>
                <p>Reconnexion en cours...</p>
            </div>
        </div>
        <router-outlet></router-outlet>
    `,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public isReconnecting = false;
    private reconnectionTimeout: any;

    constructor(
        private socket: SocketService,
        private localStorage: LocalStorageService
    ) {}

    ngOnInit() {
        this.setupSocketListeners();
        this.connectWithToken();
    }

    ngOnDestroy() {
        if (this.reconnectionTimeout) {
            clearTimeout(this.reconnectionTimeout);
        }
        this.socket.disconnect();
    }

    private setupSocketListeners(): void {
        this.socket.on('token_assigned').subscribe((data: { token: string }) => {
            console.log(`[DEBUG :: AppComponent] New token received: ${data.token}`);
            this.localStorage.saveToken(data.token);
            this.isReconnecting = false;
        });

        this.socket.on('reconnection_success').subscribe((data: any) => {
            console.log(`[DEBUG :: AppComponent] Reconnection successful:`, data);
            this.localStorage.saveToken(data.token);
            this.isReconnecting = false;
            if (this.reconnectionTimeout) {
                clearTimeout(this.reconnectionTimeout);
            }
        });

        this.socket.on('reconnection_failed').subscribe((data: any) => {
            console.log(`[DEBUG :: AppComponent] Reconnection failed:`, data);
            this.localStorage.removeToken();
            this.isReconnecting = false;
            if (this.reconnectionTimeout) {
                clearTimeout(this.reconnectionTimeout);
            }
        });

        this.socket.on('disconnect').subscribe(() => {
            console.log(`[DEBUG :: AppComponent] Socket disconnected`);
            this.handleDisconnection();
        });

        this.socket.on('connect').subscribe(() => {
            console.log(`[DEBUG :: AppComponent] Socket connected`);
            if (this.isReconnecting) {
                this.attemptReconnection();
            }
        });
    }

    private connectWithToken(): void {
        const existingToken = this.localStorage.getToken();

        if (existingToken) {
            console.log(`[DEBUG :: AppComponent] Attempting connection with existing token: ${existingToken}`);
            this.isReconnecting = true;

            this.reconnectionTimeout = setTimeout(() => {
                console.log(`[DEBUG :: AppComponent] Reconnection timeout, connecting as new client`);
                this.localStorage.removeToken();
                this.isReconnecting = false;
                this.socket.connect();
            }, 5000);

            this.socket.connect(existingToken);
        } else {
            console.log(`[DEBUG :: AppComponent] No existing token, connecting as new client`);
            this.socket.connect();
        }
    }

    private handleDisconnection(): void {
        setTimeout(() => {
            if (!this.socket.connected) {
                this.isReconnecting = true;
            }
        }, 1000);
    }

    private attemptReconnection(): void {
        const token = this.localStorage.getToken();
        if (token) {
            console.log(`[DEBUG :: AppComponent] Attempting reconnection with token: ${token}`);
            this.socket.sendMessage('tryReconnect', { token });
        } else {
            console.log(`[DEBUG :: AppComponent] No token available for reconnection`);
            this.isReconnecting = false;
        }
    }
}