import { environment } from '@env/environment'

import { SocketIoConfig } from 'ngx-socket-io';



export const HTTP_API: string = `${environment.BACK_URL}/api`;
export const SOCKET_CONFIG: SocketIoConfig = {
    url: environment.BACK_URL,
    options: {
        transports: ['websocket'],
    },
};

