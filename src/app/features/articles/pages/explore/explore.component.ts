import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticlesService } from '../../services/articles.service';
import { AllArticlesDto } from '../models/articles.model';
import { DatePipe, JsonPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, RouterLink, DatePipe, SlicePipe],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit, OnDestroy {
  articlesService = inject(ArticlesService);
  articlesSignal = signal<AllArticlesDto | null>(null);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    const offset = page;
    const limit = 3;

    this.articlesService
      .getAllArticles(offset, limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: AllArticlesDto) => {
        this.articlesSignal.set(response);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
