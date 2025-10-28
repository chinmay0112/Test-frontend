import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestResult {
  // This is a private variable to hold the results data.
  private testResults: any = null;

  constructor() {}

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
}
