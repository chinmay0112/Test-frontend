import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-test-lists',
  imports: [CommonModule],
  templateUrl: './test-lists.html',
  styleUrl: './test-lists.scss',
})
export class TestLists {
  testSeries: any; // Will hold the data for the specific series

  constructor(
    private router: Router,
    private route: ActivatedRoute // To read the ID from the URL
  ) {}

  ngOnInit(): void {
    // 1. Get the series ID from the URL
    // In a real app, you would use this ID to fetch data.
    const seriesId = this.route.snapshot.paramMap.get('id');
    console.log('Loading tests for series ID:', seriesId);

    // 2. In a real app, you would call your API:
    // this.testService.getTestSeriesDetail(seriesId).subscribe(data => {
    //   this.testSeries = data;
    // });

    // 3. Using mock data for demonstration
    // This is the data your backend would return for /api/my-tests/1/ (for example)
    this.testSeries = {
      id: 1,
      name: 'SSC CGL Tier 1 Full Mocks (2025)',
      category: 'SSC',
      description:
        'A complete series of 10 full-length mock tests designed to match the latest SSC CGL Tier 1 exam pattern, complete with detailed analysis.',
      testsCompleted: 3,
      testsTotal: 10,
      tests: [
        {
          id: 1,
          title: 'SSC CGL Mock 1',
          duration_minutes: 60,
          number_of_questions: 100,
          marks_correct: 2,
          status: 'Completed',
          resultId: 101,
        },
        {
          id: 2,
          title: 'SSC CGL Mock 2',
          duration_minutes: 60,
          number_of_questions: 100,
          marks_correct: 2,
          status: 'Completed',
          resultId: 102,
        },
        {
          id: 3,
          title: 'SSC CGL Mock 3',
          duration_minutes: 60,
          number_of_questions: 100,
          marks_correct: 2,
          status: 'Completed',
          resultId: 103,
        },
        {
          id: 4,
          title: 'SSC CGL Mock 4',
          duration_minutes: 60,
          number_of_questions: 100,
          marks_correct: 2,
          status: 'Not Started',
        },
        {
          id: 5,
          title: 'SSC CGL Mock 5',
          duration_minutes: 60,
          number_of_questions: 100,
          marks_correct: 2,
          status: 'Not Started',
        },
      ],
    };
  }

  /**
   * Navigates to the test player for a specific test.
   */
  navigateToTest(testId: number): void {
    console.log('Navigating to test with ID:', testId);
    // This will go to your /app/test/4 (for example)
    this.router.navigate(['/app/test', testId]);
  }

  /**
   * Navigates to the results page for a completed test.
   */
  navigateToResults(resultId: number): void {
    console.log('Navigating to results with ID:', resultId);
    // This will go to your /app/results/101 (for example)
    this.router.navigate(['/app/results', resultId]);
  }

  /**
   * Navigates back to the "My Test Series" library page.
   */
  goBack(): void {
    this.router.navigate(['/app/my-tests']);
  }
}
