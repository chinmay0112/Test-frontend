import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Header, Footer, ButtonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
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

  constructor(private router: Router, private fb: FormBuilder) {
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
      { name: 'SSC CGL/CHSL', icon: '🏆' },
      { name: 'Banking PO/Clerk', icon: '🏦' },
      { name: 'UPSC CSE', icon: '🏛️' },
      { name: 'Railways RRB', icon: '🚂' },
      { name: 'State PSCs', icon: '🗺️' },
      // Add more as needed
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

  onSubmitContact(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      console.log('Contact Form Submitted:', this.contactForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Thank you for contacting us! We will get back to you shortly.');
        this.contactForm.reset();
      }, 1500);
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
