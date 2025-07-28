import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { ArticleDto, PagedResultDto } from '../models/articles.model';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ChevronLeftIcon,
  ChevronsLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from 'lucide-angular';
import { ToastService } from '../../../../components/ui/services/toast.service';
import { ToastType } from '../../../../components/ui/models/toast.model';

@Component({
  selector: 'app-my-articles',
  imports: [DatePipe, LucideAngularModule, NgClass, RouterLink],
  templateUrl: './my-articles.component.html',
  styleUrl: './my-articles.component.css',
})
export class MyArticlesComponent implements OnInit, OnDestroy {
  private articlesService = inject(ArticlesService);
  articlesSignal = signal<PagedResultDto<ArticleDto> | null>(null);
  private destroy$ = new Subject<void>();
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  readonly ChevronLeft = ChevronLeftIcon;
  readonly ChevronsLeft = ChevronsLeftIcon;
  readonly ChevronRight = ChevronRightIcon;
  readonly ChevronsRight = ChevronsRightIcon;

  // CONFIG
  private limit = 3;
  private maxVisiblePages = 5;

  ngOnInit(): void {
    let page;
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (param) => {
        page = param.get('page');
        const pageNumber = page ? parseInt(page) : 1;
        this.loadPage(pageNumber);
      },
    });
  }

  getLengthOfPages() {
    return Array.from(
      { length: this.articlesSignal()!.totalPages },
      (_, i) => i + 1
    );
  }

  loadPage(page: number): void {
    const offset = page;
    this.articlesService
      .getAllArticlesByAuthor(offset, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedResultDto<ArticleDto>) => {
          this.articlesSignal.set(response);
        },
      });
  }

  deleteArticle(id: string, title: string): void {
    this.articlesService
      .deleteArticle(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPage(1);

          this.toastService.show({
            title: 'Article supprimé',
            type: ToastType.Info,
            description: [`L'article "${title}" a bien été supprimé`],
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastService.show({
            title: 'Erreur',
            type: ToastType.Error,
            description: [
              "Impossible de supprimer l'article. Veuillez réessayer.",
            ],
          });
        },
      });
  }

  visiblePages(): number[] {
    const currentPage = this.articlesSignal()?.page ?? 1;
    const totalPages = this.articlesSignal()?.totalPages ?? 1;

    const halfMaxVisiblePages = Math.floor(this.maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(currentPage + halfMaxVisiblePages, totalPages);

    if (currentPage - startPage < halfMaxVisiblePages) {
      endPage = Math.min(startPage + this.maxVisiblePages - 1, totalPages);
    }

    if (endPage - currentPage < halfMaxVisiblePages) {
      startPage = Math.max(endPage - this.maxVisiblePages + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  totalPages(): number {
    return this.articlesSignal()?.totalPages ?? 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
