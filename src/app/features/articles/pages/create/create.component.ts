import { Component, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { ToastType } from '../../../../components/ui/models/toast.model';
import { ToastService } from '../../../../components/ui/services/toast.service';
import { ArticlesService } from '../../services/articles.service';
import { CreateArticleDto } from '../models/articles.model';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  imports: [FormsModule, QuillEditorComponent, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private articlesService = inject(ArticlesService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);

  isSending = false;

  articleForm = this.fb.group({
    title: ['', [Validators.required, this.lengthRange(3, 80)]],
    description: ['', [Validators.required, this.lengthRange(10, 200)]],
    content: ['', [Validators.required, this.lengthRange(200, 150000)]],
  });
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  onSubmit(): void {
    if (this.articleForm.invalid) {
      this.showFormErrors();
      return;
    }

    this.isSending = true;

    this.articlesService
      .postArticle(this.articleForm.value as CreateArticleDto)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isSending = false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/explore']);
          this.toastService.show({
            title: 'Article publié',
            type: ToastType.Success,
            description: ['Votre contenu est maintenant en ligne'],
          });
        },
      });
  }

  private showFormErrors(): void {
    this.articleForm.markAllAsTouched();

    const errors: string[] = [];

    const titleControl = this.articleForm.get('title');
    if (titleControl?.errors) {
      if (titleControl.errors['required']) errors.push('Le titre est requis');
      if (titleControl.errors['lengthRange'])
        errors.push('Le titre doit contenir entre 3 et 80 caractères.');
    }

    const descriptionControl = this.articleForm.get('description');
    if (descriptionControl?.errors) {
      if (descriptionControl.errors['required'])
        errors.push('La description est requise');
      if (descriptionControl.errors['lengthRange'])
        errors.push('La description doit contenir entre 10 et 200 caractères.');
    }

    const contentControl = this.articleForm.get('content');
    if (contentControl?.errors) {
      if (contentControl.errors['required'])
        errors.push('Le contenu est requis');
      if (contentControl.errors['lengthRange'])
        errors.push('Le contenu de votre article est trop court ou trop long.');
    }

    this.toastService.show({
      title: 'Erreurs de validation',
      type: ToastType.Error,
      description: errors,
    });
  }

  lengthRange(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const length = control.value.length;
      if (length < min || length > max) {
        return {
          lengthRange: {
            actualLength: length,
            requiredMin: min,
            requiredMax: max,
          },
        };
      }
      return null;
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
