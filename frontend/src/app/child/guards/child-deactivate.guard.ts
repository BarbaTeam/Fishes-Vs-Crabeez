import { CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';



export const childDeactivateGuard: CanDeactivateFn<any> = (
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
    // TODO : Checking wether the child can leave (e.g with a password)
    const socket = inject(SocketService);

    const goingBackHome = (nextState?.url ?? '').startsWith('/home');
    if (goingBackHome) {
        socket.sendMessage('goBackHome');
        return true;
    }

    socket.disconnect();
    return true;
};
