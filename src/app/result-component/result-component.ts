import { Component, OnInit } from '@angular/core';
import { TestResult } from '../services/test-result';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-component',
  imports: [CommonModule],
  templateUrl: './result-component.html',
  styleUrl: './result-component.scss',
})
export class ResultComponent implements OnInit {
  constructor(private testResultService: TestResult, private router: Router) {}
  results: any;
  ngOnInit(): void {
    this.results = this.testResultService.getResults();
    if (!this.results) {
      this.router.navigate(['/']); // Navigate to home page
    }
  }
  getOptionClass(question: any, optionKey: string): string {
    const isCorrect = optionKey.toLowerCase() === question.correct_option;
    const isUserAnswer = optionKey.toLowerCase() === question.user_answer?.toLowerCase();

    if (isCorrect) {
      return 'bg-green-100 text-green-800 border-green-300'; // Correct answer
    }
    if (isUserAnswer && !question.is_correct) {
      return 'bg-red-100 text-red-800 border-red-300'; // User's incorrect answer
    }
    return 'bg-slate-50 border-slate-200'; // Default
  }
}
