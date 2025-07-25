import { Component, OnDestroy, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/user.model';
import { ToastService } from '../../../../components/ui/services/toast.service';
import { ToastType } from '../../../../components/ui/models/toast.model';

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  readonly ArrowLeft = ArrowLeftIcon;
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private toastService = inject(ToastService);
  isConnecting = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showFormErrors();
      return;
    }
    this.isConnecting = true;

    this.authService
      .login(this.loginForm.value as LoginRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isConnecting = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
      });
  }

  private showFormErrors(): void {
    this.loginForm.markAllAsTouched();

    const errors: string[] = [];
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl?.errors) {
      if (emailControl.errors['required']) errors.push("L'email est requis");
      if (emailControl.errors['email'])
        errors.push("Le format d'email est invalide");
    }

    if (passwordControl?.errors) {
      if (passwordControl.errors['required'])
        errors.push('Le mot de passe est requis');
      if (passwordControl.errors['minlength'])
        errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }

    this.toastService.show({
      title: 'Erreurs de validation',
      type: ToastType.Error,
      description: errors,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
