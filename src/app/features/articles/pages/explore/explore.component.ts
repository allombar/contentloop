import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArticlesService } from '../../services/articles.service';
import { AllArticlesDto } from '../models/articles.model';
import { JsonPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, RouterLink, SlicePipe],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent implements OnInit {
  articlesService = inject(ArticlesService);
  articlesSignal = signal<AllArticlesDto | null>(null);

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    const offset = page;
    const limit = 3;

    this.articlesService
      .getAllArticles(offset, limit)
      .subscribe((response: AllArticlesDto) => {
        this.articlesSignal.set(response);
      });
  }
}
