import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
export function authGuard(mode: 'auth' | 'guest'): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (mode === 'auth' && auth.getToken()) return true;
    if (mode === 'auth' && !auth.getToken())
      return router.createUrlTree(['/login']);

    if (mode === 'guest' && !auth.getToken()) return true;
    if (mode === 'guest' && auth.getToken()) return router.createUrlTree(['/']);

    return false;
  };
}
