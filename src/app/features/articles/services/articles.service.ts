import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllArticlesDto } from '../pages/models/articles.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private _http = inject(HttpClient);

  getAllArticles(
    offset: number = 1,
    limit: number = 5
  ): Observable<AllArticlesDto> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);

    return this._http.get<AllArticlesDto>(`${environment.apiUrl}/articles`, {
      params,
    });
  }
}
