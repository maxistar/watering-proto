import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface AuthLoginResponse {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly tokenStorageKey = 'watering-auth-token';
  private readonly token$ = new BehaviorSubject<string | null>(this.readToken());

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthLoginResponse>(`${this.apiBaseUrl}/auth/login`, { username, password })
      .pipe(
        tap((response) => this.setToken(response.token)),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  logout(): Observable<void> {
    const hasToken = this.getToken() !== null;
    this.clearToken();

    if (!hasToken) {
      return of(void 0);
    }

    return this.http
      .post<void>(`${this.apiBaseUrl}/auth/logout`, {})
      .pipe(catchError(() => of(void 0)));
  }

  getToken(): string | null {
    return this.token$.value;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  forceLogout(): void {
    this.clearToken();
  }

  authStateChanges(): Observable<string | null> {
    return this.token$.asObservable();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
    this.token$.next(token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.token$.next(null);
  }

  private readToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }
}
