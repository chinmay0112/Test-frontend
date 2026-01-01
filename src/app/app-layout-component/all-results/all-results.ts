import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Observable,
  shareReplay,
  startWith,
  BehaviorSubject,
  switchMap,
  map,
  catchError,
  of,
} from 'rxjs';
import { TestService } from '../../services/test-service';

@Component({
  selector: 'app-all-results',
  imports: [
    ProgressBarModule,
    CommonModule,
    SelectModule,
    TableModule,
    TagModule,
    FormsModule,
    SkeletonModule,
  ],
  templateUrl: './all-results.html',
  styleUrl: './all-results.scss',
})
export class AllResults implements OnInit {
  results$: Observable<any[]> | undefined;
  loading$: Observable<boolean>;
  private _loading = new BehaviorSubject<boolean>(true);
  skeletonRows = Array(5).fill(0);

  // Stats for Header Cards
  stats$: Observable<any> | undefined;

  // Filters
  selectedCategory: any = null;
  searchQuery: string = '';
  private filterSubject = new BehaviorSubject<any>({});
  private searchSubject = new Subject<string>();

  categories = [
    { label: 'All Categories', value: null },
    { label: 'SSC', value: 'SSC' },
    { label: 'Banking', value: 'Banking' },
    { label: 'Railways', value: 'Railways' },
  ];

  constructor(private testService: TestService, private router: Router) {
    this.loading$ = this._loading.asObservable();

    // Debounce search to avoid calling API on every keystroke
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query: string) => {
        this.searchQuery = query;
        this.triggerSearch();
      });
  }

  ngOnInit() {
    // 1. Get Stats (as Observable)
    this.stats$ = this.testService.getHistoryStats().pipe(shareReplay(1));

    // 2. Setup Results Stream
    this.setupResultsStream();
  }

  setupResultsStream() {
    this.results$ = this.filterSubject.pipe(
      switchMap((params) => {
        this._loading.next(true);
        return this.testService.getTestHistory(params).pipe(
          map((data: any) => {
            this._loading.next(false);
            return Array.isArray(data) ? data : data.results;
          }),
          catchError((err) => {
            console.error('Failed to load history', err);
            this._loading.next(false);
            return of([]);
          })
        );
      }),
      shareReplay(1)
    );
  }

  triggerSearch() {
    const params: any = {};
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    this.filterSubject.next(params);
  }

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  onCategoryChange() {
    this.triggerSearch();
  }

  navigateToAnalysis(resultId: number) {
    this.router.navigate(['/app/analysis', resultId]);
  }

  getScoreColor(accuracy: number): string {
    if (accuracy >= 80) return '#10b981'; // Green
    if (accuracy >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  }
}
