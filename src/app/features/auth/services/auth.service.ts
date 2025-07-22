import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  UserData,
  UserDto,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private readonly API_URL = 'https://localhost:7167';
  private readonly TOKEN_KEY = 'auth_token';

  user = signal<UserDto | null>(null);

  login(user: LoginRequest): Observable<UserData> {
    return this._http
      .post<UserData>(`${this.API_URL}/api/auth/login`, user)
      .pipe(
        tap((userData) => this.setToken(userData.token)),
        map((userData: UserData) => {
          delete userData.token;

          return userData;
        }),
        tap(({ user }: UserData) => this.user.set(user))
      );
  }

  register(user: RegisterRequest): Observable<UserData> {
    return this._http
      .post<UserData>(`${this.API_URL}/api/auth/register`, user)
      .pipe(
        tap((userData) => this.setToken(userData.token!)),
        map((userData: UserData) => {
          delete userData.token;
          return userData;
        }),
        tap(({ user }: UserData) => this.user.set(user))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);

    this.user.set(null);
    this._router.navigate(['/']);
  }

  fetchCurrentUser(): Observable<UserDto> {
    return this._http
      .get<UserDto>(`${this.API_URL}/api/auth/me`)
      .pipe(tap((user: UserDto) => this.user.set(user)));
  }

  setToken(token: string | undefined): void {
    let tokenEncoded;
    if (token) tokenEncoded = btoa(token);

    if (tokenEncoded) localStorage.setItem(this.TOKEN_KEY, tokenEncoded);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (!token) return null;

    return atob(token);
  }

  isAuthenticated(): boolean {
    return !!this.user();
  }

  get currentUser(): UserDto | null {
    return this.user();
  }

  setUser(user: UserDto | null) {
    this.user.set(user);
  }
}
