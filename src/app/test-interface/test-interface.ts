import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestService } from '../services/test-service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { TabsModule } from 'primeng/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TestResult } from '../services/test-result';

@Component({
  selector: 'app-test-interface',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, CommonModule, TabsModule, FormsModule],
  templateUrl: './test-interface.html',
  styleUrl: './test-interface.scss',
})
export class TestInterface implements OnInit, OnDestroy {
  constructor(
    private testService: TestService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private testResultService: TestResult
  ) {}
  test: any;
  sections: any[] = [];
  questions: any[] = [];
  selectedTabIndex = 0; // default tab index
  activeTabId: any = null; // current active tab value (section id)
  markedForReview: { [key: number]: boolean } = {};
  answers: { [key: number]: string } = {};
  visitedQuestions: { [key: number]: boolean } = {};
  remainingSeconds: any;
  private timerInterval: any;
  currentQuestionIndexes: { [key: number]: number } = {};
  getTestbyId(id: number): void {
    this.testService.getTestById(id).subscribe({
      next: (res: any) => {
        console.log('API Data:', res);
        this.test = res;
        this.remainingSeconds = this.test.duration_minutes * 60;
        this.startTimer();
        this.sections = res.sections || [];
        this.sections.forEach((s) => (this.currentQuestionIndexes[s.id] = 0));
        this.selectedTabIndex = 0;
        //  Ensures UI updates even if async zone missed
        if (this.sections.length > 0) {
          this.activeTabId = this.sections[0].id;
        }
        this.visitedQuestions[this.sections[0]?.questions[0]?.id] = true;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching test:', err),
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const getId = params.get('id');
      if (getId) {
        const testId = Number(getId);
        this.getTestbyId(testId);
      }
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
  getCurrentQuestion(section: any) {
    const index = this.currentQuestionIndexes[section.id];
    return section.questions[index];
  }

  nextQuestion(section: any) {
    const index = this.currentQuestionIndexes[section.id];
    if (index < section.questions.length - 1) {
      this.currentQuestionIndexes[section.id]++;
    }
    this.visitedQuestions[this.getCurrentQuestion(section)?.id] = true;
  }

  prevQuestion(section: any) {
    const index = this.currentQuestionIndexes[section.id];
    if (index > 0) {
      this.currentQuestionIndexes[section.id]--;
    }
  }
  onTabChange(newTabId: any) {
    this.activeTabId = newTabId;
    const section = this.sections.find((s) => s.id === newTabId);
    const firstQ = section?.questions?.[this.currentQuestionIndexes[section.id]];
    if (firstQ) this.visitedQuestions[firstQ.id] = true;
  }
  submitTest() {
    const payload: {
      user_id: number;
      responses: {
        question_id: number;
        selected_answer: string | null;
        marked_for_review: boolean;
      }[];
    } = {
      user_id: 1, // Replace this with your actual logged-in user id
      responses: [],
    };

    this.sections.forEach((section) => {
      section.questions.forEach((q: any) => {
        payload.responses.push({
          question_id: q.id,
          selected_answer: this.answers[q.id] || null,
          marked_for_review: !!this.markedForReview[q.id],
        });
      });
    });

    console.log('📦 Sending Payload:', payload);

    this.testService.submitTest(this.test.id, payload).subscribe({
      next: (res) => {
        console.log('✅ Test submitted successfully:', res);
        alert('Test submitted successfully!');
        this.testResultService.setResults(res);
        this.router.navigate(['/results']);
      },
      error: (err) => {
        console.error('❌ Error submitting test:', err);
        alert('Failed to submit test. Please try again.');
      },
    });
  }

  jumpToQuestion(section: any, index: number) {
    this.currentQuestionIndexes[section.id] = index;
    this.visitedQuestions[this.getCurrentQuestion(section)?.id] = true;
  }
  get activeSection() {
    return this.sections[this.selectedTabIndex];
  }
  markForReview(question: any) {
    this.markedForReview[question.id] = !this.markedForReview[question.id];
  }
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      } else {
        clearInterval(this.timerInterval);
        this.submitTest();
      }
      this.cd.detectChanges();
    }, 1000);
  }
  // Add this getter inside your TestInterface class
  get formattedTime(): string {
    if (
      this.remainingSeconds === undefined ||
      this.remainingSeconds === null ||
      this.remainingSeconds < 0
    ) {
      return '00:00:00'; // Return default if time is not set or negative
    }

    const hours = Math.floor(this.remainingSeconds / 3600);
    const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
    const seconds = this.remainingSeconds % 60;

    // Use padStart to add leading zeros if needed
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }
}
