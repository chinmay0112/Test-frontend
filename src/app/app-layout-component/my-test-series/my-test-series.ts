import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { Select, SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-my-test-series',
  imports: [ButtonModule, SelectModule, TagModule, ProgressBarModule, CommonModule, FormsModule],
  templateUrl: './my-test-series.html',
  styleUrl: './my-test-series.scss',
})
export class MyTestSeries {
  // This is the master list of all series the user is enrolled in.
  // In a real app, this would be fetched from your API (e.g., /api/my-test-series/)
  allMySeries: any[] = [];

  // This is the list that gets displayed after filtering.
  filteredSeries: any[] = [];

  // Filter and Search Properties
  searchTerm: string = '';
  selectedCategory: string | null = null;
  categories: any[] = [
    { name: 'SSC', value: 'SSC' },
    { name: 'Banking', value: 'Banking' },
    { name: 'UPSC', value: 'UPSC' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // This mock data shows that the component can handle different categories, just as you wanted.
    this.allMySeries = [
      {
        id: 1,
        name: 'SSC CGL Tier 1 Full Mocks (2025)',
        category: 'SSC',
        image: 'https://placehold.co/600x400/DBEAFE/1E40AF?text=SSC',
        testsCompleted: 3,
        testsTotal: 10,
      },
      {
        id: 2,
        name: 'Bank PO Prelims Practice (IBPS)',
        category: 'Banking',
        image: 'https://placehold.co/600x400/FEE2E2/B91C1C?text=Banking',
        testsCompleted: 1,
        testsTotal: 20,
      },
      {
        id: 3,
        name: 'UPSC GS Paper 1 Series (2025)',
        category: 'UPSC',
        image: 'https://placehold.co/600x400/D1FAE5/065F46?text=UPSC',
        testsCompleted: 8,
        testsTotal: 15,
      },
      {
        id: 4,
        name: 'SSC CHSL (10+2) Practice Set',
        category: 'SSC',
        image: 'https://placehold.co/600x400/E0E7FF/3730A3?text=SSC+CHSL',
        testsCompleted: 0,
        testsTotal: 10,
      },
    ];

    // Initialize the filtered list to show all tests at the start
    this.filteredSeries = this.allMySeries;
  }

  /**
   * Filters the test series based on the search term and selected category.
   */
  filterTests(): void {
    let tempSeries = this.allMySeries;

    // 1. Filter by Category
    if (this.selectedCategory) {
      tempSeries = tempSeries.filter((series) => series.category === this.selectedCategory);
    }

    // 2. Filter by Search Term
    if (this.searchTerm) {
      tempSeries = tempSeries.filter((series) =>
        series.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredSeries = tempSeries;
  }

  /**
   * Navigates to the detailed list of tests for a specific series.
   */
  navigateToSeries(seriesId: number): void {
    console.log('Navigating to test series with ID:', seriesId);
    // This now correctly navigates to the "inner page"
    // e.g., /app/my-tests/1
    this.router.navigate(['/app/my-tests', seriesId]);
  }
}
