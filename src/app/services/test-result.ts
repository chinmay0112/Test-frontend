import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestResult {
  // This is a private variable to hold the results data.
  private testResults: any = null;

  constructor(private http: HttpClient) {}

  // The "Warehouse" will call this method to put the data in the truck.
  setResults(results: any): void {
    this.testResults = results;
  }

  // The "Showroom" will call this method to get the data from the truck.
  getResults(): any {
    const results = this.testResults;
    // For safety, we clear the data after it's been retrieved once.
    this.testResults = null;
    return results;
  }

  getReportCard(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/api/results/${id}/`);
  }

  getLeaderboard(testId: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/tests/${testId}/leaderboard/`);
  }

  getResultList() {
    return this.http.get<any>(`${environment.apiUrl}/api/results/`);
  }
}
