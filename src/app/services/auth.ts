import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);

  login(email: any, password: any) {
    const body = {
      email: email,
      password: password,
    };
    return this.http.post(`${environment.apiUrl}/login/`, body);
  }
}
