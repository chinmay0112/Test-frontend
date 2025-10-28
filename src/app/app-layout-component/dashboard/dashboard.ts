import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { SafeHtmlPipe } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CarouselModule,
    ProgressBarModule,
    ButtonModule,
    AvatarModule,
    TableModule,
    SafeHtmlPipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // Mock data for the dashboard
  performanceStats: any[] = [];
  myTestSeries: any[] = [];
  continueLearning: any;
  recentActivity: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // In a real application, this data would come from API calls to your Django backend.
    this.performanceStats = [
      {
        label: 'Tests Taken',
        value: '12',
        icon: 'pi pi-file-edit',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      {
        label: 'Avg. Score',
        value: '78.5%',
        icon: 'pi pi-chart-line',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      {
        label: 'Questions Attempted',
        value: '1,250',
        icon: 'pi pi-question-circle',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600',
      },
      {
        label: 'Accuracy',
        value: '88%',
        icon: 'pi pi-check-circle',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
    ];

    this.myTestSeries = [
      { id: 1, name: 'SSC CGL Tier 1 Full Mocks', category: 'SSC', icon: '🏆', progress: 75 },
      { id: 2, name: 'Bank PO Prelims Practice', category: 'Banking', icon: '🏦', progress: 40 },
      { id: 3, name: 'UPSC GS Paper 1 Series', category: 'UPSC', icon: '🏛️', progress: 10 },
    ];

    this.continueLearning = {
      id: 2,
      name: 'Bank PO Prelims Mock 3',
      category: 'Banking',
      description: 'You left off on question 15 in the Reasoning section.',
    };

    this.recentActivity = [
      {
        id: 12,
        name: 'SSC CGL Mock 2',
        category: 'SSC',
        score: '115.5',
        accuracy: 82,
        date: 'Oct 18, 2025',
      },
      {
        id: 11,
        name: 'Bank PO Mock 2',
        category: 'Banking',
        score: '72.0',
        accuracy: 75,
        date: 'Oct 17, 2025',
      },
      {
        id: 10,
        name: 'SSC CGL Mock 1',
        category: 'SSC',
        score: '101.0',
        accuracy: 71,
        date: 'Oct 15, 2025',
      },
    ];
  }

  // --- NAVIGATION METHODS ---

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  navigateToTestSeries(seriesId: number): void {
    console.log('Navigating to test series with ID:', seriesId);
    this.router.navigate(['/test-series', seriesId]);
  }

  resumeTest(testId: number): void {
    console.log('Resuming test with ID:', testId);
    this.router.navigate(['/test', testId]);
  }

  navigateToAnalysis(activityId: number): void {
    console.log('Navigating to analysis for activity ID:', activityId);
    this.router.navigate(['/analysis', activityId]);
  }

  logout(): void {
    console.log('Logging out...');
    // Here you would call your AuthService to clear tokens
    this.router.navigate(['/login']);
  }
}
