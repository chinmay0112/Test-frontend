// auth-api.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  constructor(private http: HttpClient) {}

  refreshToken(refresh: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${environment.apiUrl}/api/auth/token/refresh/`, {
      refresh,
    });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/users/me/`);
  }
}
