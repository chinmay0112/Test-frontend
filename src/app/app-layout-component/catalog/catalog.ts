import { ChangeDetectorRef, Component } from '@angular/core';
import { TestService } from '../../services/test-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, SkeletonModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  allTestSeries: any[] = [];
  filteredTestSeries: any[] = [];
  categories: string[] = [];
  selectedCategories: Set<string> = new Set();
  loading = true;
  categoriesLoading = true;
  errorMessage: string | null = null;

  constructor(
    private testService: TestService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTestSeries();
    this.getExamNames();
  }
  getExamNames() {
    this.testService.getExamNames().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.categories = res.map((item: any) => item.name);
        } else if (res.name) {
          this.categories = res.name;
        }
        this.categoriesLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching exam names:', err);
        this.categoriesLoading = false;
      },
    });
  }
  loadTestSeries() {
    this.loading = true;
    this.errorMessage = null;
    this.testService.getTestSeries().subscribe({
      next: (res: any) => {
        this.allTestSeries = res;
        this.filteredTestSeries = this.allTestSeries;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching test series:', err);
        this.errorMessage = 'Failed to load test series. Please try again.';
        this.loading = false;
      },
    });
  }

  // --- Filtering Logic ---
  toggleCategory(category: string) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedCategories.size === 0) {
      this.filteredTestSeries = this.allTestSeries;
    } else {
      this.filteredTestSeries = this.allTestSeries.filter((series) =>
        this.selectedCategories.has(series.category)
      );
    }
  }

  clearFilters() {
    this.selectedCategories.clear();
    this.filteredTestSeries = this.allTestSeries;
  }

  // --- Navigation ---
  viewSeries(id: number) {
    this.router.navigate(['/app/test-series', id]);
  }
}
