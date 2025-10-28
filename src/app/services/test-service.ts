import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  http = inject(HttpClient);

  getTestById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tests/${id}/`);
  }
  submitTest(testId: number, data: any) {
    return this.http.post(`${environment.apiUrl}/tests/${testId}/submit/`, data);
  }
}
