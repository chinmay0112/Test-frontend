import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    Header,
    Footer,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    CarouselModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  providers: [MessageService],
})
export class Home implements OnInit {
  features: any[] = [];
  testimonials: any[] = [];
  examsCovered: any[] = [];
  howItWorksSteps: any[] = [];
  currentYear = new Date().getFullYear();
  isMobileMenuOpen = false; // State for mobile menu
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;
  responsiveOptions: any[] | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.features = [
      {
        icon: 'pi-desktop',
        title: 'Realistic Exam Interface',
        description:
          'Experience the actual exam environment with our timed tests and identical interface.',
      },
      {
        icon: 'pi-chart-line',
        title: 'In-Depth Performance Analysis',
        description:
          'Identify your strengths and weaknesses with detailed score reports and topic-wise breakdowns.',
      },
      {
        icon: 'pi-check-square',
        title: 'Expertly Curated Questions',
        description:
          'Practice with high-quality questions designed by experienced educators based on the latest syllabus.',
      },
    ];

    this.examsCovered = [
      { name: 'SSC CGL/CHSL', icon: 'assets/images/ssc-logo.png' },
      { name: 'Banking PO/Clerk', icon: 'assets/images/ibps-logo.png' },
      { name: 'UPSC CSE/State PSCs', icon: 'assets/images/upsc-logo.png' },
      { name: 'Railways RRB', icon: 'assets/images/railway-logo.png' },

      { name: 'Defence Exams', icon: 'assets/images/upsc-logo.png' },
      { name: 'Teaching Exams', icon: 'assets/images/ctet-logo.png' },
      { name: 'GATE/ESE', icon: 'assets/images/gate-logo.png' },
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this.howItWorksSteps = [
      { title: 'Sign Up', description: 'Create your account in seconds and get started for free.' },
      {
        title: 'Choose Your Test',
        description: 'Select from a wide range of mock tests for your target exam.',
      },
      {
        title: 'Analyze & Improve',
        description: 'Review detailed results and focus on your weak areas.',
      },
    ];

    this.testimonials = [
      {
        name: 'Priya Sharma',
        exam: 'SSC CGL Cleared',
        quote:
          "PrepMaster's mock tests were crucial for my preparation. The analysis helped me focus on my weak areas.",
        avatar: 'https://placehold.co/64x64/E0E7FF/4338CA?text=PS',
      },
      {
        name: 'Amit Singh',
        exam: 'Bank PO Cleared',
        quote:
          'The timed practice and realistic interface gave me the confidence I needed on exam day. Highly recommended!',
        avatar: 'https://placehold.co/64x64/DBEAFE/1E40AF?text=AS',
      },
      {
        name: 'Neha Gupta',
        exam: 'UPSC Aspirant',
        quote:
          'The quality of questions and detailed explanations are top-notch. It significantly boosted my GS score.',
        avatar: 'https://placehold.co/64x64/CFFAFE/0E7490?text=NG',
      },
    ];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu(); // Close menu on navigation
  }

  scrollTo(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.closeMobileMenu(); // Close menu after clicking a scroll link
  }

  // --- Mobile Menu Logic ---
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onSubmitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http.post(`${environment.apiUrl}/api/contact/`, this.contactForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.contactForm.reset();
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send message. Please try again.',
        });
      },
    });
  }
}
