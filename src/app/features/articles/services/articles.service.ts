import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  PagedResultDto,
  ArticleDto,
  CreateArticleDto,
  UpdateArticleDto,
} from '../pages/models/articles.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private _http = inject(HttpClient);

  getAllArticles(
    offset: number = 1,
    limit: number = 5
  ): Observable<PagedResultDto<ArticleDto>> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);

    return this._http.get<PagedResultDto<ArticleDto>>(
      `${environment.apiUrl}/articles`,
      {
        params,
      }
    );
  }

  getArticleById(id: string): Observable<ArticleDto> {
    return this._http.get<ArticleDto>(`${environment.apiUrl}/articles/${id}`);
  }

  postArticle(article: CreateArticleDto): Observable<void> {
    return this._http.post<void>(`${environment.apiUrl}/articles/`, article);
  }

  deleteArticle(id: string): Observable<void> {
    return this._http.delete<void>(`${environment.apiUrl}/articles/${id}`);
  }

  updateArticle(id: string, updateData: UpdateArticleDto): Observable<void> {
    return this._http.patch<void>(
      `${environment.apiUrl}/articles/${id}`,
      updateData
    );
  }

  getAllArticlesByAuthor(
    offset: number = 1,
    limit: number = 5
  ): Observable<PagedResultDto<ArticleDto>> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);

    return this._http.get<PagedResultDto<ArticleDto>>(
      `${environment.apiUrl}/articles/author`,
      {
        params,
      }
    );
  }
}
