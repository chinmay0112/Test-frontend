import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestService } from '../../services/test-service';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestResult } from '../../services/test-result';
import { Auth } from '../../services/auth';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-test-interface',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReactiveFormsModule,
    CheckboxModule,
    CommonModule,
    TabsModule,
    FormsModule,
    RouterLink,
    TableModule,
  ],
  templateUrl: './test-interface.html',
  styleUrl: './test-interface.scss',
})
export class TestInterface implements OnInit, OnDestroy {
  constructor(
    private testService: TestService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private testResultService: TestResult,
    public authService: Auth
  ) {}
  test: any;
  sections: any[] = [];
  questions: any[] = [];
  isLocked = false;
  isLoading = true; // Add loading state
  selectedTabIndex = 0; // default tab index
  activeTabId: any = null; // current active tab value (section id)
  markedForReview: { [key: number]: boolean } = {};
  answers: { [key: number]: string } = {};
  visitedQuestions: { [key: number]: boolean } = {};
  remainingSeconds: any;
  private saveProgressInterval: any;
  isInstructionsVisible = false;
  checked = false;

  private timerInterval: any;
  currentQuestionIndexes: { [key: number]: number } = {};
  getTestbyId(id: number): void {
    this.isLocked = false;
    this.isLoading = true; // Start loading
    this.testService.getTestById(id).subscribe({
      next: (res: any) => {
        console.log('API Data:', res);
        this.test = res;
        this.remainingSeconds = this.test.duration_minutes * 60;

        this.sections = res.sections || [];
        const totalDurationSecs = this.test.duration_minutes * 60;
        const hasSavedTime =
          res.saved_time_remaining !== undefined && res.saved_time_remaining !== null;
        const hasSavedResponses = res.saved_responses && res.saved_responses.length > 0;
        if (hasSavedTime || hasSavedResponses) {
          console.log('Resuming Test...');

          // A. Restore Time
          if (hasSavedTime && res.saved_time_remaining < totalDurationSecs - 5) {
            this.remainingSeconds = res.saved_time_remaining;
          } else {
            this.remainingSeconds = totalDurationSecs;
          }

          // B. Restore Answers (THIS WAS MISSING)
          if (hasSavedResponses) {
            res.saved_responses.forEach((savedItem: any) => {
              // Restore Answer
              if (savedItem.selected_answer) {
                this.answers[savedItem.question_id] = savedItem.selected_answer;
                this.visitedQuestions[savedItem.question_id] = true;
              }
              // Restore Review Status
              if (savedItem.marked_for_review) {
                this.markedForReview[savedItem.question_id] = true;
                this.visitedQuestions[savedItem.question_id] = true;
              }
            });
          }
          this.selectedTabIndex = 0;
          if (this.sections.length > 0) {
            this.activeTabId = this.sections[0].id;
            // Mark first question as visited
            if (this.sections[0].questions?.[0]) {
              this.visitedQuestions[this.sections[0].questions[0].id] = true;
            }
          }
          this.isInstructionsVisible = false; // Skip instructions
          this.startTimer();
          this.startAutoSave();
        } else {
          console.log('Starting new test...');
          this.remainingSeconds = totalDurationSecs;
          this.isInstructionsVisible = true;
        }

        this.sections.forEach((s) => (this.currentQuestionIndexes[s.id] = 0));
        this.selectedTabIndex = 0;
        //  Ensures UI updates even if async zone missed
        if (this.sections.length > 0) {
          this.activeTabId = this.sections[0].id;
        }
        this.visitedQuestions[this.sections[0]?.questions[0]?.id] = true;
        this.isLoading = false; // Stop loading on success
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isLoading = false; // Stop loading on error
        this.isLocked = true;
        console.error('Error fetching test:', err);
        if (err.status === 403) {
          this.isLocked = true;
        } else if (err.status === 404) {
          alert('Test Not found');
        } else {
          alert('Network Error. Please try again');
        }
        this.cd.detectChanges();
      },
    });
  }
  beginExam() {
    this.isInstructionsVisible = false; // Swaps the view
    this.startTimer();
    this.startAutoSave();
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
    clearInterval(this.saveProgressInterval);
  }
  getCurrentQuestion(section: any) {
    const index = this.currentQuestionIndexes[section.id];
    return section.questions[index];
  }
  navigateToPricing() {
    this.router.navigate(['/app/prices']);
  }
  startAutoSave() {
    // Save progress every 30 seconds
    this.saveProgressInterval = setInterval(() => {
      const payload = this.generatePayload();
      if (this.test && this.remainingSeconds > 0) {
        this.testService.getProgress(this.test.id, payload).subscribe({
          next: () => console.log('Auto-saved progress', payload),
          error: (err) => console.error('Auto-save failed', err),
        });
      }
    }, 30000);
  }

  nextQuestion(section: any) {
    const index = this.currentQuestionIndexes[section.id];
    if (index < section.questions.length - 1) {
      this.currentQuestionIndexes[section.id]++;
      this.visitedQuestions[this.getCurrentQuestion(section)?.id] = true;
    } else {
      // Check if there is a next section
      const currentSectionIndex = this.sections.findIndex((s) => s.id === section.id);
      if (currentSectionIndex < this.sections.length - 1) {
        const nextSection = this.sections[currentSectionIndex + 1];
        this.activeTabId = nextSection.id; // Switch tab
        this.selectedTabIndex = currentSectionIndex + 1; // Update selected index
        this.currentQuestionIndexes[nextSection.id] = 0; // Go to first question of next section
        this.visitedQuestions[nextSection.questions[0].id] = true; // Mark as visited
      }
    }
  }
  private generatePayload() {
    const payload: {
      test_id: number;
      user_id: number;
      remaining_time?: number; // Add this field
      responses: {
        question_id: number;
        selected_answer: string | null;
        marked_for_review: boolean;
      }[];
    } = {
      test_id: this.test.id,
      user_id: this.authService.currentUser.value?.id
        ? Number(this.authService.currentUser.value.id)
        : 0,
      remaining_time: this.remainingSeconds, // Include time in payload
      responses: [],
    };

    this.sections.forEach((section) => {
      section.questions.forEach((q: any) => {
        // Only send questions that have been interacted with to save bandwidth
        if (this.answers[q.id] || this.markedForReview[q.id]) {
          payload.responses.push({
            question_id: q.id,
            selected_answer: this.answers[q.id] || null,
            marked_for_review: !!this.markedForReview[q.id],
          });
        }
      });
    });

    return payload;
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
    clearInterval(this.timerInterval);
    clearInterval(this.saveProgressInterval);
    const payload: {
      test_id: number;
      user_id: number;
      responses: {
        question_id: number;
        selected_answer: string | null;
        marked_for_review: boolean;
      }[];
    } = {
      test_id: this.test.id,
      user_id: this.authService.currentUser.value?.id
        ? Number(this.authService.currentUser.value.id)
        : 0,
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
        this.router.navigate([`app/results/${this.test.id}`]);
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
  markForReview(question: any, section: any) {
    this.markedForReview[question.id] = !this.markedForReview[question.id];
    this.nextQuestion(section);
  }
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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
  clearResponse(section: any) {
    const currentQ = this.getCurrentQuestion(section);
    if (currentQ) {
      delete this.answers[currentQ.id];
    }
  }

  isFullScreen = false;

  toggleFullScreen() {
    const elem = document.documentElement;

    if (!this.isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      this.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullScreen = false;
    }
  }
}
