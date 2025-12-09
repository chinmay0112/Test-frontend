import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { TestResult } from '../services/test-result';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-result-component',
  imports: [CommonModule, ChartModule, RouterModule, AvatarModule],
  templateUrl: './result-component.html',
  styleUrl: './result-component.scss',
})
export class ResultComponent implements OnInit {
  results: any;
  chartData: any;
  chartOptions: any;
  barChartData: any;
  barChartOptions: any;
  leaderboard: any[] = [];

  constructor(
    private testResultService: TestResult,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        // 1. Get Result ID from URL and fetch Report Card
        switchMap((params) => {
          const resultId = params['id'];
          return this.testResultService.getReportCard(resultId);
        }),
        // 2. Report Card Loaded -> Now fetch Leaderboard using the Test ID found inside it
        switchMap((report: any) => {
          console.log('✅ Report Data:', report);
          this.results = report;
          this.initChart();

          // CRITICAL: Extract the Test ID from the report data
          // Ensure your TestResultDetailSerializer in Django includes 'test' (the ID)
          const testId = report.test;
          console.log('Test ID:', testId);

          if (testId) {
            return this.testResultService.getLeaderboard(testId);
          } else {
            console.warn('Test ID not found in report data. Cannot fetch leaderboard.');
            return of([]); // Return empty array if no test ID
          }
        })
      )
      .subscribe({
        next: (leaderboardData: any[]) => {
          // 3. Leaderboard Loaded
          console.log('🏆 Leaderboard Data:', leaderboardData);
          this.leaderboard = leaderboardData;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error loading results page:', err);
          if (err.status === 404) {
            alert('Result not found.');
            this.router.navigate(['/app/dashboard']);
          }
        },
      });
  }

  getMaxMarks() {
    if (!this.results) return 0;
    const marksPerQ = this.results.marks_correct || 1;
    return this.results.total_questions * marksPerQ;
  }

  toggleExplanation(question: any) {
    question.showExplanation = !question.showExplanation;
  }
  goToAnalysis() {
    this.router.navigate(['/app/analysis', this.results.id]);
  }
  initChart() {
    this.chartData = {
      labels: ['Correct', 'Incorrect', 'Skipped'],
      datasets: [
        {
          data: [
            this.results.correct_count,
            this.results.incorrect_count,
            this.results.unanswered_count,
          ],
          backgroundColor: [
            '#22c55e', // Green-500
            '#ef4444', // Red-500
            '#cbd5e1', // Slate-300
          ],
          hoverBackgroundColor: ['#16a34a', '#dc2626', '#94a3b8'],
          borderWidth: 0,
        },
      ],
    };

    this.chartOptions = {
      cutout: '75%', // Makes it a thin ring
      plugins: {
        legend: {
          display: false, // We built a custom legend in HTML
        },
      },
    };

    const sections = this.results.section_analysis || [];
    const labels = sections.map((s: any) => s.section_name);
    const correctData = sections.map((s: any) => s.correct);
    const incorrectData = sections.map((s: any) => s.incorrect);
    const skippedData = sections.map((s: any) => s.total_questions - s.attempted);

    this.barChartData = {
      labels: labels.length ? labels : ['No Data'],
      datasets: [
        {
          label: 'Correct',
          backgroundColor: '#22c55e',
          data: correctData.length ? correctData : [0],
        },
        {
          label: 'Incorrect',
          backgroundColor: '#ef4444',
          data: incorrectData.length ? incorrectData : [0],
        },
        {
          label: 'Skipped',
          backgroundColor: '#cbd5e1',
          data: skippedData.length ? skippedData : [0],
        },
      ],
    };

    this.barChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }
}
