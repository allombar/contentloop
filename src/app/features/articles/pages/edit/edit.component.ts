import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ArticleDto } from '../models/articles.model';
import { ToastType } from '../../../../components/ui/models/toast.model';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { ToastService } from '../../../../components/ui/services/toast.service';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, QuillEditorComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articlesService = inject(ArticlesService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  originalArticle = signal<ArticleDto | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  hasError = signal(false);

  articleForm!: FormGroup;
  articleId!: string;

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

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.articleId = params.get('id')!;
      if (this.articleId) {
        this.loadArticle();
      } else {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private loadArticle(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.articlesService
      .getArticleById(this.articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.originalArticle.set(article);
          this.initializeForm(article);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
          this.toastService.show({
            title: 'Erreur',
            type: ToastType.Error,
            description: ["Impossible de charger l'article."],
          });
        },
      });
  }

  private initializeForm(article: ArticleDto): void {
    this.articleForm = this.fb.group({
      title: [article.title, [Validators.required, Validators.minLength(5)]],
      description: [
        article.description,
        [Validators.required, Validators.minLength(10)],
      ],
      content: [
        article.content,
        [
          Validators.required,
          Validators.minLength(200),
          Validators.maxLength(150000),
        ],
      ],
    });
  }

  hasChanges(): boolean {
    if (!this.articleForm || !this.originalArticle()) return false;

    const current = this.articleForm.value;
    const original = this.originalArticle()!;

    return (
      current.title !== original.title ||
      current.description !== original.description ||
      current.content !== original.content
    );
  }

  resetForm(): void {
    if (this.originalArticle()) {
      this.initializeForm(this.originalArticle()!);
      this.toastService.show({
        title: 'Modifications annulées',
        type: ToastType.Info,
        description: ['Le formulaire a été restauré aux valeurs originales.'],
      });
    }
  }

  onSubmit(): void {
    if (!this.articleForm.valid || !this.hasChanges()) return;

    this.isSaving.set(true);
    const formData = this.articleForm.value;

    this.articlesService
      .updateArticle(this.articleId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSaving.set(false);

          this.toastService.show({
            title: 'Article mis à jour',
            type: ToastType.Success,
            description: [
              'Vos modifications ont été sauvegardées avec succès.',
            ],
          });

          this.router.navigate(['/article', this.articleId]);
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          this.isSaving.set(false);

          this.toastService.show({
            title: 'Erreur de sauvegarde',
            type: ToastType.Error,
            description: [
              'Impossible de sauvegarder les modifications. Veuillez réessayer.',
            ],
          });
        },
      });
  }

  goBack(): void {
    if (this.hasChanges()) {
      const confirmLeave = confirm(
        'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?'
      );
      if (!confirmLeave) return;
    }

    this.router.navigate(['/my-articles']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
