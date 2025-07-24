import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../components/ui/services/toast.service';
import { ToastType } from '../../components/ui/models/toast.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.show({
          title: 'Erreur',
          type: ToastType.Error,
          description: [error.error.errors],
        });
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

      return throwError(() => error);
    })
  );
};
