import { CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';



// NOTE : Added for uniformity with `/child` & `/ergo`
export const homeDeactivateGuard: CanDeactivateFn<any> = (
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
    return true;
};
