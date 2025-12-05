import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TestResult } from '../services/test-result';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-component',
  imports: [CommonModule, ChartModule, RouterModule],
  templateUrl: './result-component.html',
  styleUrl: './result-component.scss',
})
export class ResultComponent implements OnInit {
  results: any;
  chartData: any;
  chartOptions: any;
  barChartData: any;
  barChartOptions: any;
  topUsers: any[] = [];

  constructor(
    private testResultService: TestResult,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.testResultService.getReportCard(params['id']).subscribe((data) => {
        console.log(data);
        this.results = data;
        this.initChart();
        this.cd.detectChanges();
      });
    });
    // Dummy data since testResult service is not available
    // this.results = {
    //   completed_at: new Date().toISOString(),
    //   test_details: {
    //     title: 'Mock Test Series - Level 1',
    //     marks_correct: 2,
    //   },
    //   score: 160,
    //   total_questions: 100,
    //   correct_count: 80,
    //   incorrect_count: 10,
    //   unanswered_count: 10,
    //   full_results: Array.from({ length: 100 }, (_, i) => ({
    //     id: i + 1,
    //     question_text: `This is a sample question text for question #${
    //       i + 1
    //     }. It is designed to test the layout and styling of the result component.`,
    //     user_answer: i < 80 ? 'A' : i < 90 ? 'B' : null,
    //     correct_option: 'A',
    //     is_correct: i < 80,
    //     explanation:
    //       'This is a detailed explanation of why the answer is correct. It helps the user understand the concept better.',
    //   })),
    // };

    if (this.results) {
      this.initChart();
    }
  }

  getMaxMarks() {
    if (!this.results) return 0;
    const marksPerQ = this.results.marks_correct || 1;
    return this.results.total_questions * marksPerQ;
  }

  toggleExplanation(question: any) {
    question.showExplanation = !question.showExplanation;
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

    this.topUsers = [
      {
        rank: 1,
        name: 'Kartik Saini',
        score: 192,
        accuracy: 96,
        avatar: 'https://i.pravatar.cc/150?u=2',
      },
      {
        rank: 2,
        name: 'Chinmay Kulshreshtha',
        score: 188,
        accuracy: 94,
        avatar: 'https://i.pravatar.cc/150?u=2',
      },
      {
        rank: 3,
        name: 'Sujata Rani',
        score: 185,
        accuracy: 92,
        avatar: 'https://i.pravatar.cc/150?u=3',
      },

      {
        rank: 5,
        name: 'Emma Thompson',
        score: 175,
        accuracy: 88,
        avatar: 'https://i.pravatar.cc/150?u=5',
      },
      {
        rank: 5,
        name: 'Priya Aggarwal',
        score: 175,
        accuracy: 88,
        avatar: 'https://i.pravatar.cc/150?u=5',
      },
      {
        rank: 6,
        name: 'Emma Thompson',
        score: 175,
        accuracy: 88,
        avatar: 'https://i.pravatar.cc/150?u=5',
      },
      {
        rank: 7,
        name: 'Emma Thompson',
        score: 175,
        accuracy: 88,
        avatar: 'https://i.pravatar.cc/150?u=5',
      },
      {
        rank: 192,
        name: 'Kunal Tanwar',
        score: -178,
        accuracy: -89,
        avatar: 'https://i.pravatar.cc/150?u=4',
      },
    ];
  }
}
