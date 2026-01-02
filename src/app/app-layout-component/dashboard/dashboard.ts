import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../services/dashboard';
import { forkJoin, Observable } from 'rxjs';
import { Auth } from '../../services/auth';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    ProgressBarModule,
    ButtonModule,
    AvatarModule,
    TableModule,
    ChartModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [MessageService],
})
export class Dashboard {
  // Data Models
  performanceStats: any[] = [];
  myTestSeries: any[] = [];
  continueLearning: any;
  recentActivity: any[] = [];
  isLoading: boolean = false;
  verificationLoading = false;
  verificationSent = false;
  trendChartData: any;
  trendChartOptions: any;
  trendData: any[] = [];
  accuracyChartData: any;
  accuracyChartOptions: any;
  doughnutChartData: any;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef,
    public authService: Auth,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    forkJoin({
      stats: this.dashboardService.getStats(),
      trend: this.dashboardService.getTrends(),
      recent: this.dashboardService.getRecentActivity(),
      resume: this.dashboardService.getResume(),
      mySeries: this.dashboardService.getMySeries(),
    }).subscribe({
      next: (res) => {
        this.isLoading = true;
        this.trendData = res.trend;
        this.performanceStats = [
          {
            label: 'Tests Taken',
            value: res.stats.tests_taken,
            // trend: '+2 this week',
            trendColor: 'text-green-500',
            icon: 'pi pi-file-edit',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
          {
            label: 'Avg. Score',
            value: res.stats.avg_score,
            // trend: '+1.5% increase',
            trendColor: 'text-green-500',
            icon: 'pi pi-chart-line',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
          },
          {
            label: 'Questions Attempted',
            value: res.stats.questions_attempted,
            // trend: 'Total attempted',
            trendColor: 'text-slate-400',
            icon: 'pi pi-bolt',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
          },
          {
            label: 'Accuracy',
            value: res.stats.accuracy,
            // trend: '-2% decrease',
            trendColor: 'text-red-500',
            icon: 'pi pi-bullseye',
            bgColor: 'bg-teal-50',
            iconColor: 'text-teal-600',
          },
        ];
        this.continueLearning = res.resume;
        this.myTestSeries = res.mySeries;
        this.recentActivity = res.recent;
        this.initCharts();
        this.doughnutChartData = res.stats.chart_data || { correct: 0, incorrect: 0, skipped: 0 };

        // 2. Doughnut Chart: Accuracy Breakdown
        this.accuracyChartData = {
          labels: ['Correct', 'Incorrect', 'Skipped'],
          datasets: [
            {
              data: [
                this.doughnutChartData.correct,
                this.doughnutChartData.incorrect,
                this.doughnutChartData.skipped,
              ],
              backgroundColor: ['#10B981', '#EF4444', '#94A3B8'], // Green, Red, Slate
              hoverBackgroundColor: ['#059669', '#DC2626', '#64748B'],
            },
          ],
        };

        this.accuracyChartOptions = {
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true } },
          },
        };
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.isLoading = false;
  }
  navigateTo(id: number) {
    this.router.navigate(['/app/test', id]);
  }

  // Trend Filter
  selectedTrendRange: number = 5;

  onTrendRangeChange() {
    this.initCharts();
  }

  initCharts() {
    // Slice data based on selection. Assuming data is in order, we take the last N items.
    // If API returns undefined order, user might need to sort. Assuming insertion order for now.
    const filteredTrend =
      this.trendData && this.trendData.length ? this.trendData.slice(-this.selectedTrendRange) : [];

    const labels = filteredTrend.map((item) => item.test_title || `Test ${item.id}`);

    const scores = filteredTrend.map((item) => Number(item.score));
    // 1. Line Chart: Score Trends over last 5 tests
    this.trendChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Your Score',
          data: scores,
          fill: true,
          borderColor: '#4F46E5', // Indigo-600
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
        },
      ],
    };

    this.trendChartOptions = {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
        x: { grid: { display: false } },
      },
    };
  }
  requestVerification() {
    this.router.navigate(['/app/profile']);
  }
}
