import { inject } from '@angular/core';
import {
    CanActivateFn,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
    // Access dependencies as needed using inject()
    const authService = inject(AuthService);
    const router = inject(Router);
    const isAuth = authService.getIsAuth ();

    if (!isAuth) {
        router.navigate (['/login']);
    } // if - else

    return isAuth;
};