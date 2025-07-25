import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../components/ui/services/toast.service';
import { RegisterRequest } from '../../models/user.model';
import { ToastType } from '../../../../components/ui/models/toast.model';
@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  readonly ArrowLeft = ArrowLeftIcon;
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private toastService = inject(ToastService);

  isRegistering = false;
  passwordValue = signal('');

  hasMinLength = computed(() => this.passwordValue().length >= 8);
  hasLowercase = computed(() => /[a-z]/.test(this.passwordValue()));
  hasUppercase = computed(() => /[A-Z]/.test(this.passwordValue()));
  hasNumber = computed(() => /\d/.test(this.passwordValue()));
  hasSpecialChar = computed(() => /[@$!%*?&]/.test(this.passwordValue()));

  passwordStrength = computed(() => {
    const checks = [
      this.hasMinLength(),
      this.hasLowercase(),
      this.hasUppercase(),
      this.hasNumber(),
      this.hasSpecialChar(),
    ];
    return checks.filter(Boolean).length;
  });

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password: string = control.get('password')?.value;
      const confirmPassword: string = control.get('confirmPassword')?.value;

      if (password && confirmPassword && password !== confirmPassword)
        return { passwordmismatch: true };

      return null;
    };
  }

  registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordMatchValidator()] }
  );

  ngOnInit() {
    this.registerForm
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.passwordValue.set(value || ''));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showFormErrors();
      return;
    }

    this.isRegistering = true;

    this.authService
      .register(this.registerForm.value as RegisterRequest)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isRegistering = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.toastService.show({
            title: 'Compte créé avec succès',
            type: ToastType.Success,
            description: ['Bienvenue !'],
          });
        },
      });
  }

  private showFormErrors(): void {
    this.registerForm.markAllAsTouched();

    const errors: string[] = [];

    const firstNameControl = this.registerForm.get('firstName');
    if (firstNameControl?.errors) {
      if (firstNameControl.errors['required'])
        errors.push('Le prénom est requis');
      if (firstNameControl.errors['minlength'])
        errors.push('Le prénom doit contenir au moins 2 caractères');
    }

    const lastNameControl = this.registerForm.get('lastName');
    if (lastNameControl?.errors) {
      if (lastNameControl.errors['required']) errors.push('Le nom est requis');
      if (lastNameControl.errors['minlength'])
        errors.push('Le nom doit contenir au moins 2 caractères');
    }

    const emailControl = this.registerForm.get('email');
    if (emailControl?.errors) {
      if (emailControl.errors['required']) errors.push("L'email est requis");
      if (emailControl.errors['email'])
        errors.push("Le format d'email est invalide");
    }

    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.errors) {
      if (passwordControl.errors['required'])
        errors.push('Le mot de passe est requis');
      if (passwordControl.errors['minlength'])
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
      if (passwordControl.errors['pattern'])
        errors.push(
          'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        );
    }

    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (confirmPasswordControl?.errors?.['required']) {
      errors.push('La confirmation du mot de passe est requise');
    }

    if (this.registerForm.errors?.['passwordmismatch']) {
      errors.push('Les mots de passe ne correspondent pas');
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
