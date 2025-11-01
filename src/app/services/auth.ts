import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);
  private loggedInStatus = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.loggedInStatus.asObservable();
  constructor() {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (access && refresh) {
      this.loggedInStatus.next(true);
    }
  }
  // To check if a user is logged in or not

  isUserLoggedIn() {
    return this.loggedInStatus.value;
  }

  login(email: any, password: any) {
    const body = {
      email: email,
      password: password,
    };
    return this.http.post(`${environment.apiUrl}/login/`, body).pipe(
      //tap is like spy data, runs on every successful api response
      tap((response: any) => {
        // we will set items
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);

        //Changing the logged in status
        this.loggedInStatus.next(true);
      })
    );
  }
  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    const payload = {
      refresh: refreshToken,
    };
    return this.http.post(`${environment.apiUrl}/token/refresh`, payload).pipe(
      tap((response: any) => {
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
  }
}
