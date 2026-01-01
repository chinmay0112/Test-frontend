import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  http = inject(HttpClient);

  getTestById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/tests/${id}/`);
  }
  submitTest(testId: number, data: any) {
    return this.http.post(`${environment.apiUrl}/api/tests/${testId}/submit/`, data);
  }
  getListOfTests(id: number) {
    return this.http.get(`${environment.apiUrl}/api/test-series/${id}/`);
  }
  getTestSeries() {
    return this.http.get(`${environment.apiUrl}/api/test-series/`);
  }
  getProgress(testId: number, payload: any) {
    return this.http.post(`${environment.apiUrl}/api/tests/${testId}/save-progress/`, payload);
  }
  getExamNames() {
    return this.http.get(`${environment.apiUrl}/api/exam-names/`);
  }
  getTestHistory(params: any = {}) {
    let httpParams = new HttpParams();

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.category)
      httpParams = httpParams.set('test__test_series__category__name', params.category);

    return this.http.get(`${environment.apiUrl}/api/history/`, { params: httpParams });
  }

  // 2. Fetch the Top Cards Data
  getHistoryStats() {
    return this.http.get(`${environment.apiUrl}/api/history/stats/`);
  }
}
