import crypto from 'crypto';
import { Server, Socket } from 'socket.io';

import { AppClient } from ".";
import { AppClientSnapshot, AppClientToken, SocketID } from './types';



////////////////////////////////////////////////////////////////////////////////
// App Clients Manager :
////////////////////////////////////////////////////////////////////////////////

export class AppClientsManagers {
    private constructor() {}

    private static readonly _CONNECTED_CLIENTS_MAP
        : Record<AppClientToken, AppClient> = {};
    private static readonly _DISCONNECTED_CLIENTS_SNAPSHOT_MAP
        : Record<AppClientToken, AppClientSnapshot> = {};


    ////////////////////////////////////////////////////////////////////////////
    // Utils :

    private static generateToken(socketId: SocketID): AppClientToken {
        const timestamp = Date.now();
        const hash = crypto.createHash('sha256')
            .update(socketId + timestamp.toString())
            .digest('hex');
        return hash.substring(0, 32); // Token of 32 characters
    }


    ////////////////////////////////////////////////////////////////////////////
    // Actions :

    public static registerClient(client: AppClient) {
        this._CONNECTED_CLIENTS_MAP[this.generateToken(client.socket.id)] = client;
    }

    public static takeClientSnapshot(client: AppClient) {
        const snapshot = client.toSnapshot();
        delete this._CONNECTED_CLIENTS_MAP[client.token]
    }

    public static cleanExpiredClientsSnapshot() {
        const now = Date.now();
        for (const [token, snapshot] of Object.entries(this._DISCONNECTED_CLIENTS_SNAPSHOT_MAP)) {
            if (now > snapshot.expiresAt) {
                delete this._DISCONNECTED_CLIENTS_SNAPSHOT_MAP[token];
                console.log(`[DEBUG :: TokenManager] Token ${token} expired and removed`);
            }
        }
    }

    public static restoreClient(io: Server, socket: Socket, token: AppClientToken) {
        this._CONNECTED_CLIENTS_MAP[token] = AppClient.fromSnapshot(
            io,
            socket,
            this._DISCONNECTED_CLIENTS_SNAPSHOT_MAP[token],
        );
    }
}
