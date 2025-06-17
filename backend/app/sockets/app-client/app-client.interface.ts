import { Server, Socket } from 'socket.io';

import { AppClientRole } from "./roles/app-client-role.enum";
import { AppClientToken, AppClientSnapshot } from "./types";



export interface IAppClient {
    // static fromSnapshot(io: Server, socket: Socket, snapshot: AppClientSnapshot): AppClient;
    toSnapshot(): AppClientSnapshot;

    readonly role: AppClientRole;

    get token(): AppClientToken;
    set token(token: AppClientToken);

    disconnect(): void;
}
