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

    /*
    const goingBackHome = (nextState?.url ?? '').startsWith('/home');
    if (goingBackHome) {
        alert("cc");
        socket.on<void>('goBackHome');
        return true;
    }
    */

    socket.disconnect();
    return true;
};
