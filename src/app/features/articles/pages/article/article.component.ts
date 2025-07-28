import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ArticleDto } from '../models/articles.model';
import { DatePipe } from '@angular/common';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { QuillViewHTMLComponent } from 'ngx-quill';

@Component({
  selector: 'app-article',
  imports: [DatePipe, LucideAngularModule, RouterLink, QuillViewHTMLComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
})
export class ArticleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  readonly ArrowLeft = ArrowLeftIcon;

  private articlesService = inject(ArticlesService);
  private activatedRoute = inject(ActivatedRoute);

  articleSignal = signal<ArticleDto | null>(null);

 

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (param) => {
        const id = param.get('id');
        if (id)
          this.articlesService
            .getArticleById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data) => {
                this.articleSignal.set(data);
              },
            });
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
