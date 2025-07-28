import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../components/ui/services/toast.service';
import { ToastType } from '../../components/ui/models/toast.model';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.show({
          title: 'Erreur',
          type: ToastType.Error,
          description: [error.error.errors],
        });

        router.navigate(['/login']);
        authService.logout();
      }

      if (error.status === 500) {
        toastService.show({
          title: 'Erreur serveur',
          type: ToastType.Error,
          description: [
            'Une erreur serveur est survenue. Veuillez contacter un administrateur',
          ],
        });
      }

      if (error.status === 0) {
        toastService.show({
          title: 'Erreur serveur',
          type: ToastType.Error,
          description: [
            'Les serveurs sont indisponibles. Veuillez contacter un administrateur.',
          ],
        });
      }
      return throwError(() => error);
    })
  );
};
