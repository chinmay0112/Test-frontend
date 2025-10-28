import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-test-series-catalog',
  imports: [CommonModule, SelectModule, TagModule, FormsModule, ProgressSpinnerModule],
  templateUrl: './test-series-catalog.html',
  styleUrl: './test-series-catalog.scss',
})
export class TestSeriesCatalog {
  // --- State Variables ---
  isLoading = true;

  // --- Data ---
  allTestSeries: any[] = [];
  filteredSeries: any[] = [];

  // --- Filter and Search Properties ---
  searchTerm: string = '';
  selectedCategory: string | null = null;
  categories: any[] = [
    { name: 'All Categories', value: null },
    { name: 'SSC', value: 'SSC' },
    { name: 'Banking', value: 'Banking' },
    { name: 'UPSC', value: 'UPSC' },
    { name: 'Railways', value: 'Railways' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // In a real app, you would fetch this from your API.
    // We simulate a 1-second API call.
    setTimeout(() => {
      this.allTestSeries = [
        {
          id: 1,
          name: 'SSC CGL Tier 1 Full Mocks (2025)',
          category: 'SSC',
          image: 'https://placehold.co/600x400/DBEAFE/1E40AF?text=SSC+CGL',
          testCount: 15,
          questionCount: 100,
          price: 499,
          oldPrice: 999,
        },
        {
          id: 2,
          name: 'Bank PO Prelims Practice (IBPS)',
          category: 'Banking',
          image: 'https://placehold.co/600x400/FEE2E2/B91C1C?text=Bank+PO',
          testCount: 20,
          questionCount: 100,
          price: 599,
        },
        {
          id: 3,
          name: 'UPSC GS Paper 1 Series (2025)',
          category: 'UPSC',
          image: 'https://placehold.co/600x400/D1FAE5/065F46?text=UPSC',
          testCount: 10,
          questionCount: 100,
          price: 799,
          oldPrice: 1499,
        },
        {
          id: 4,
          name: 'SSC CHSL (10+2) Practice Set',
          category: 'SSC',
          image: 'https://placehold.co/600x400/E0E7FF/3730A3?text=SSC+CHSL',
          testCount: 10,
          questionCount: 100,
          price: 399,
        },
        {
          id: 5,
          name: 'RRB NTPC Stage 1 Mocks',
          category: 'Railways',
          image: 'https://placehold.co/600x400/FEF9C3/854D0E?text=Railways',
          testCount: 25,
          questionCount: 120,
          price: 499,
        },
        {
          id: 6,
          name: 'IBPS Clerk Mains Series',
          category: 'Banking',
          image: 'https://placehold.co/600x400/FCE7F3/9D174D?text=IBPS+Clerk',
          testCount: 10,
          questionCount: 190,
          price: 699,
          oldPrice: 1299,
        },
      ];

      this.filteredSeries = this.allTestSeries;
      this.isLoading = false;
    }, 1000);
  }

  /**
   * Filters the test series based on the search term and selected category.
   */
  filterSeries(): void {
    let tempSeries = this.allTestSeries;

    // 1. Filter by Category
    if (this.selectedCategory) {
      tempSeries = tempSeries.filter((series) => series.category === this.selectedCategory);
    }

    // 2. Filter by Search Term
    if (this.searchTerm) {
      tempSeries = tempSeries.filter(
        (series) =>
          series.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          series.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredSeries = tempSeries;
  }

  /**
   * Resets all active filters.
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.filterSeries();
  }

  /**
   * Returns a PrimeNG severity color based on the category for the tag.
   */
  getCategorySeverity(category: string): 'info' | 'danger' | 'success' | 'warn' | 'secondary' {
    switch (category) {
      case 'SSC':
        return 'info';
      case 'Banking':
        return 'danger';
      case 'UPSC':
        return 'success';
      case 'Railways':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  /**
   * Navigates to the detailed page for a specific series.
   */
  navigateToSeries(seriesId: number): void {
    console.log('Navigating to test series detail page for ID:', seriesId);
    // This would navigate to a "product detail" page for the series
    this.router.navigate(['/app/series-detail', seriesId]);
  }
}
