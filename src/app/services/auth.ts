import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

/* ---------- Types (adjust to your backend shape) ---------- */
export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password1: string;
  password2: string;
}

export interface RegisterResponse {
  token?: string; // some APIs return access token directly
  access?: string; // or this (if same as login)
  refresh?: string;
  message?: string;
  userId?: string | number;
}

export interface User {
  id: number | string;
  email: string;
  full_name?: string;
  firstName?: string; // we set this client-side
  [k: string]: any;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  http = inject(HttpClient);

  private loggedInStatus = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedInStatus.asObservable();

  public currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (access && refresh) {
      this.loggedInStatus.next(true);
      this.fetchCurrentUser().subscribe();
    }
  }

  /* ------------ Auth helpers ------------ */

  isUserLoggedIn() {
    return this.loggedInStatus.value;
  }

  /* ------------ REGISTER ------------ */
  register(payload: RegisterRequest): Observable<RegisterResponse> {
    // NOTE: endpoint ko apne backend ke hisaab se change karo
    return this.http
      .post<RegisterResponse>(`${environment.apiUrl}/auth/registration/`, payload)
      .pipe(
        tap((res) => {
          // Agar API registration par token bhi de deti hai:
          const token = res.token ?? res.access;
          if (token) {
            localStorage.setItem('access_token', token);
            if (res.refresh) localStorage.setItem('refresh_token', res.refresh);
            this.loggedInStatus.next(true);
            this.fetchCurrentUser().subscribe();
          }
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }

  /* ------------ LOGIN ------------ */
  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login/`, body).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.fetchCurrentUser().subscribe();
        this.loggedInStatus.next(true);
      })
    );
  }

  /* ------------ REFRESH ------------ */
  refreshToken(): Observable<{ access: string }> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    const payload = { refresh: refreshToken };

    // Consistent trailing slash (Django style). Change if your API differs.
    return this.http.post<{ access: string }>(`${environment.apiUrl}/token/refresh/`, payload).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access);
        this.loggedInStatus.next(true);
      }),
      catchError((err) => {
        console.error(err);
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedInStatus.next(false);
    this.currentUser.next(null);
  }

  /* ------------ CURRENT USER ------------ */
  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me/`).pipe(
      tap((user) => {
        user.firstName = user.full_name ? user.full_name.split(' ')[0] : 'User';
        this.currentUser.next(user);
      }),
      catchError((err) => {
        console.error('Failed to fetch user, logging out.', err);
        this.logout();
        return throwError(() => err);
      })
    );
  }
}
