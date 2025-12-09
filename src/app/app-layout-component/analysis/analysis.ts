import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { TestResult } from '../../services/test-result';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-analysis',
  imports: [CommonModule, TabsModule, FormsModule, TableModule],
  templateUrl: './analysis.html',
  styleUrl: './analysis.scss',
})
export class Analysis implements OnInit {
  results: any;
  sectionAnalysis: any[] = [];
  activeTabId: any = null; // current active tab value (section id)
  currentQuestionIndexes: { [key: string]: number } = {};
  responses: any[] = [];
  constructor(
    private testResultService: TestResult,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.testResultService.getReportCard(params['id']).subscribe((res) => {
        this.results = res;
        this.responses = res.responses;
        this.sectionAnalysis = res.section_analysis;
        if (this.sectionAnalysis && this.sectionAnalysis.length > 0) {
          this.activeTabId = this.sectionAnalysis[0].section_name;
          this.sectionAnalysis.forEach((sec) => {
            this.currentQuestionIndexes[sec.section_name] = 0;
          });
        }
        console.log(this.results);
        this.cdr.detectChanges();
      });
    });
  }
  onTabChange(newTabId: any) {
    this.activeTabId = newTabId;
  }
  getCurrentQuestion(sectionName: any) {
    const sectionResponses = this.getSectionResponses(sectionName);
    const index = this.currentQuestionIndexes[sectionName];
    return sectionResponses[index];
  }

  nextQuestion(sectionName: any) {
    const questions = this.getSectionResponses(sectionName);
    // 1. If not the last question of THIS section, just go next
    if (this.currentQuestionIndexes[sectionName] < questions.length - 1) {
      this.currentQuestionIndexes[sectionName]++;
    } else {
      // 2. If it Is the last question, switch to NEXT section
      const currentSectionIndex = this.sectionAnalysis.findIndex(
        (s) => s.section_name === sectionName
      );

      if (currentSectionIndex !== -1) {
        // Calculate next section index (modulus for looping to start)
        const nextSectionIndex = (currentSectionIndex + 1) % this.sectionAnalysis.length;
        const nextSection = this.sectionAnalysis[nextSectionIndex];

        // Switch tab and reset/ensure index is 0
        this.activeTabId = nextSection.section_name;
        // Optionally reset the next section's question to 0 if desirable (usually yes for "flow")
        // this.currentQuestionIndexes[nextSection.section_name] = 0;
      }
    }
  }

  prevQuestion(sectionName: any) {
    if (this.currentQuestionIndexes[sectionName] > 0) {
      this.currentQuestionIndexes[sectionName]--;
    }
  }
  viewExplanation(sectionName: any) {
    const currentQ = this.getCurrentQuestion(sectionName);
    if (currentQ) {
      currentQ.showExplanation = !currentQ.showExplanation;
    }
  }
  getSectionResponses(sectionName: string) {
    if (!this.sectionAnalysis || !this.responses) return [];

    const activeSectionObj = this.sectionAnalysis.find((s) => s.section_name === sectionName);
    if (!activeSectionObj) return [];

    const sectionIdToCheck = activeSectionObj.section_id || activeSectionObj.id;
    return this.responses.filter((r) => r.question.section === sectionIdToCheck);
  }

  // NEW: Jump to specific question from palette
  jumpToQuestion(sectionName: string, index: number) {
    this.currentQuestionIndexes[sectionName] = index;
  }
}
