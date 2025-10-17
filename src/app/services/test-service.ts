import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  http = inject(HttpClient);

  getTestById(id: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/tests/${id}/`);
  }
}
