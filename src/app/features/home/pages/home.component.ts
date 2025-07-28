import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ArticlesService } from '../../articles/services/articles.service';
import {
  ArticleDto,
  PagedResultDto,
} from '../../articles/pages/models/articles.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  articlesService = inject(ArticlesService);
  articlesSignal = signal<PagedResultDto<ArticleDto> | null>(null);
  destroy$ = new Subject<void>();

  user = this.authService.user;
  isAuthenticated = computed(() => this.user());

  ngOnInit(): void {
    this.articlesService
      .getAllArticles(1, 3)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.articlesSignal.set(data);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
