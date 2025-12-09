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
          this.activeTabId = this.sectionAnalysis[0].id;
        }
        console.log(this.results);
        this.cdr.detectChanges();
      });
    });
  }
  onTabChange(newTabId: any) {
    this.activeTabId = newTabId;
  }
}
