import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { News, SelectedNews } from '../interfaces/news';
import { Journalist, SelectedJournalist } from '../interfaces/journalist';
import {
  Token,
  Viewer,
  ViewerLogin,
  ViewerRegister,
} from '../interfaces/viewer';
import { Review, ReviewGetting, ReviewPost } from '../interfaces/review';
import { CookieService } from 'ngx-cookie-service';

let headers = new HttpHeaders({
  'Content-Type': 'application/json',
});
let opts = { headers: headers };

@Injectable({
  providedIn: 'root',
})
export class FetchingService {
  constructor(private http: HttpClient, private cookies: CookieService) {}

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`/api/news`);
  }

  getJournalists(): Observable<Journalist[]> {
    return this.http.get<Journalist[]>(`/api/journalists`);
  }

  getNewsById(id: string): Observable<SelectedNews> {
    return this.http.get<SelectedNews>(`/api/news/${id}`);
  }

  getJournalistById(id: string): Observable<SelectedJournalist> {
    return this.http.get<SelectedJournalist>(
      `/api/journalists/${id}`
    );
  }

  registerViewer(payload: ViewerRegister): Observable<Viewer | void> {
    return this.http
      .post<Viewer>(`/api/auth/register`, payload, opts)
      .pipe(catchError(async (err) => console.log(err)));
  }

  loginViewer(payload: ViewerLogin): Observable<Token | undefined> {
    return this.http.post<Token>(`/api/auth/login`, payload, opts).pipe(
      catchError(async (err) => {
        console.log(err);
        return undefined;
      })
    );
  }

  postReview(payload: ReviewPost): Observable<Review> {
    return this.http.post<Review>('/api/reviews', payload, {
      headers: {
        Authorization: `Bearer ${this.cookies.get('@Token')}`,
      },
    });
  }

  getReview(payload: ReviewGetting): Observable<string> {
    return this.http.post<string>(
      '/api/reviews/data',
      {
        viewer_posted: payload.viewer_posted,
        news_related: payload.news_related,
      },
      {
        headers: {
          Authorization: `Bearer ${this.cookies.get('@Token')}`,
        },
      }
    );
  }

  getIdByToken(): Observable<string> {
    return this.http.get<string>('/api/viewers/token', {
      headers: { Authorization: `Bearer ${this.cookies.get('@Token')}` },
    });
  }

  patchReview(id: string, payload: ReviewPost): Observable<ReviewPost> {
    return this.http.patch<ReviewPost>(`/api/reviews/${id}`, payload, {
      headers: { Authorization: `Bearer ${this.cookies.get('@Token')}` },
    });
  }

  deleteReview(id: string): void {
    this.http.delete(`/api/reviews/${id}`, {
      headers: { Authorization: `Bearer ${this.cookies.get('@Token')}` },
    }).subscribe(() => console.log("oh cholera"));
  }
}
