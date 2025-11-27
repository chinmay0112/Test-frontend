// auth.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthApi } from './auth-api';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../app.config';

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

  constructor(private authApiService: AuthApi, private oAuthService: OAuthService) {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (access && refresh) {
      this.loggedInStatus.next(true);
      this.fetchCurrentUser().subscribe();
    }
  }
  loginWithGoogle(): void {
    // This simply redirects the user to Google's login page.
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=513830597696-3769ch6r4m755e2pgd2tir0jigooc9am&redirect_uri=https://examprepare.netlify.app/google-callback&response_type=code&scope=openid%20email%20profile&access_type=offline';
  }

  // --- 5. THIS IS CALLED BY YOUR CALLBACK COMPONENT ---
  handleGoogleCallback(code: string): Observable<any> {
    // The library has processed the URL and has the "code" (the "valet key")

    if (!code) {
      return throwError(() => new Error('No code found from Google callback'));
    }

    // Now, we send this code to our OWN backend at /api/auth/google/
    return this.http.post(`${environment.apiUrl}/api/auth/google/`, { code: code }).pipe(
      tap((response: any) => {
        // SUCCESS! Our backend swapped the code for our OWN tokens.
        // We save them just like a normal email login.
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.loggedInStatus.next(true);
        this.fetchCurrentUser().subscribe();
      })
    );
  }
  /* ------------ Auth helpers ------------ */

  isUserLoggedIn() {
    return this.loggedInStatus.value;
  }

  /* ------------ REGISTER ------------ */
  register(payload: RegisterRequest): Observable<RegisterResponse> {
    // NOTE: endpoint ko apne backend ke hisaab se change karo
    return this.http.post<RegisterResponse>(
      `${environment.apiUrl}/api/auth/registration/`,
      payload
    );
  }

  /* ------------ LOGIN ------------ */
  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login/`, body).pipe(
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
      return throwError(() => new Error('No refresh token'));
    }

    return this.authApiService.refreshToken(refreshToken).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access);
        this.loggedInStatus.next(true);
      }),
      catchError((err) => {
        console.error('Refresh failed:', err);
        this.logout();
        return throwError(() => err);
      })
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.authApiService.getCurrentUser().pipe(
      tap((user) => {
        user.firstName = user['first_name'] ?? 'User';
        this.currentUser.next(user);
      }),
      catchError((err) => {
        console.error('Failed to fetch user, logging out.', err);
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
  completeProfile(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/complete-profile/`, data).pipe(
      tap((res) => {
        const oldUser = this.currentUser.value;

        if (!oldUser) return;

        // ---- Build a fully typed updated user ----
        const updatedUser: User = {
          id: oldUser.id,
          email: oldUser.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,

          // UI convenience fields
          firstName: data.first_name,
          full_name: `${data.first_name} ${data.last_name}`,
        };

        // ---- Update BehaviorSubject and localStorage ----
        this.currentUser.next(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
    );
  }
  createRazorpayOrder(planId: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/payments/create-order/`, {
      plan_id: planId,
    });
  }
  verifyPayment(paymentDetails: any): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${environment.apiUrl}/api/payments/verify/`,
      paymentDetails
    );
  }
}
