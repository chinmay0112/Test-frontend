import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../services/test-service';
import { SkeletonModule } from 'primeng/skeleton';
import { Auth } from '../../services/auth';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-test-lists',
  imports: [CommonModule, SkeletonModule, TabsModule],
  templateUrl: './test-lists.html',
  styleUrl: './test-lists.scss',
})
export class TestLists {
  testSeries: any; // Will hold the data for the specific series
  isProMember = false;
  userSubscription: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private testService: TestService,
    private cdr: ChangeDetectorRef,
    public authService: Auth
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.isProMember = !!user.is_pro_active;
      }
    });

    this.route.paramMap.subscribe((params) => {
      const seriesId = params.get('id');
      console.log('Loading tests for series ID:', seriesId);

      if (seriesId) {
        this.testService.getListOfTests(Number(seriesId)).subscribe({
          next: (data) => {
            console.log('Data fetched:', data);
            this.testSeries = data;
            this.cdr.detectChanges(); // Force UI update
          },
          error: (err) => {
            console.error('Error fetching test series:', err);
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  navigateToTest(testId: number): void {
    console.log('Navigating to test with ID:', testId);
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
    this.router.navigate(['/app/catalog']);
  }

  isTestLocked(index: number): boolean {
    // Lock if user is NOT pro AND it's not the first test (index > 0)
    return !this.isProMember && index > 0;
  }

  handleLockClick(testId: number) {
    this.router.navigate(['/app/test', testId]);
  }
}
