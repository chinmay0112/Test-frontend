import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/dashboard/stats/`);
  }
  getTrends(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/dashboard/trend/`);
  }
  getResume(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/dashboard/resume/`);
  }
  getRecentActivity(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/dashboard/recent/`);
  }
  getMySeries(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/dashboard/my_series/`);
  }
}
