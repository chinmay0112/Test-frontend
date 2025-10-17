import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestService } from '../services/test-service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-test-interface',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [ReactiveFormsModule, CommonModule, TabsModule, FormsModule],
  templateUrl: './test-interface.html',
  styleUrl: './test-interface.scss',
})
export class TestInterface implements OnInit {
  constructor(private testService: TestService, private cd: ChangeDetectorRef) {}
  test: any;
  sections: any[] = [];
  questions: any[] = [];
  selectedTabIndex = 0; // default tab index
  activeTabId: any = null; // current active tab value (section id)
  markedForReview: { [key: number]: boolean } = {};
  answers: { [key: number]: string } = {};
  visitedQuestions: { [key: number]: boolean } = {};

  currentQuestionIndexes: { [key: number]: number } = {};
  getTestbyId(): void {
    this.testService.getTestById(3).subscribe({
      next: (res: any) => {
        console.log('API Data:', res);
        this.test = res;
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
    this.getTestbyId();
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
  submitAnswer(section: any) {
    const question = this.getCurrentQuestion(section);
    console.log('Submitted answer for Q' + question.id, this.answers[question.id]);
    // You can call your API here to save the answer
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
}
