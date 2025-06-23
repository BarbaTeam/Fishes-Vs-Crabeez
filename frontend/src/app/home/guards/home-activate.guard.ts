import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SocketService } from '@app/shared/services/socket.service';



export const homeActivateGuard: CanActivateFn = (
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | Promise<boolean> | Observable<boolean> => {
    const socket = inject(SocketService);
    socket.connect();
    return true;
};