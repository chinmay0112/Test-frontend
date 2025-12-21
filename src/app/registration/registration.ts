import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { finalize, tap } from 'rxjs';
/* 1) Auth service se sahi cheezein import kari hai:
   - RegisterResponse type ko bhi yahin se laye hai taaki res ka type fix ho. */
import { Auth, RegisterResponse } from '../services/auth';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Password match validator
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password1 = control.get('password1');
  const password2 = control.get('password2');
  return password1 && password2 && password1.value !== password2.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    CommonModule,
    InputOtpModule,
    FormsModule,
  ],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
  providers: [MessageService],
})
export class Registration {
  constructor(private messageService: MessageService) {}

  // 2) NonNullableFormBuilder -> safer controls (no null)
  private fb = inject(FormBuilder).nonNullable;
  private router = inject(Router);
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  // 3) Yahan explicit type do, taaki "this.auth is unknown" na aaye
  private auth: Auth = inject(Auth);

  // UI state
  loading = signal(false);
  serverError = signal<string | null>(null);

  // Verification & OTP state
  verificationEmailSent = signal(false);
  isEmailSent = signal(false);
  showOtpModal = signal(false);

  // OTP Logic state
  otpDigits: string = '';
  timeLeft: number = 30;
  showResend: boolean = false;
  interval: any;

  isRegistrationSuccessful = signal(false);

  // Form group
  registrationForm: FormGroup = this.fb.group(
    {
      first_name: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      }),
      last_name: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      phone: this.fb.control('', {
        // India mobile: 10 digits, 6-9 se start
        validators: [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      }),
      password1: this.fb.control('', {
        // NOTE: backend rule ke saath sync
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/), // letters + numbers
        ],
      }),
      password2: this.fb.control('', {
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator }
  );

  get f() {
    return this.registrationForm.controls as any;
  }

  onSubmit(): void {
    this.loading.set(true);

    this.sendOtp();
  }

  // Stubs for verification flow
  sendVerificationMail(): void {
    console.log('Sending verification mail...');
  }

  sendOtp(): void {
    this.auth
      .sendOtp(this.registrationForm.value.phone)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((next) => {
        console.log('OTP sent successfully', next);
        this.showOtpModal.set(true);
        this.startTimer();
      });
  }

  startTimer() {
    this.timeLeft = 30;
    this.showResend = false;
    this.stopTimer();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.showResend = true;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  verifyAndCreateAccount(): void {
    const enteredOtp = this.otpDigits;

    // 1. Basic Validation: Don't send if empty or too short
    if (!enteredOtp || enteredOtp.length < 6) {
      return;
    }

    this.loading.set(true);
    this.serverError.set(null); // Clear previous error messages

    const raw = this.registrationForm.getRawValue();
    const payload = {
      first_name: String(raw.first_name).trim(),
      last_name: String(raw.last_name).trim(),
      email: String(raw.email).trim().toLowerCase(),
      phone: String(raw.phone).trim(),
      password1: raw.password1,
      password2: raw.password2,
      otp: enteredOtp,
    };

    this.auth
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: RegisterResponse) => {
          // --- SUCCESS FLOW ---
          console.log('Registration Successful', res);

          // 1. Close Modal
          this.showOtpModal.set(false);
          this.stopTimer();

          // 2. Handle Auto-Login vs Email Verification
          if (res?.token || (res as any)?.access) {
            this.isRegistrationSuccessful.set(true);
            this.registrationForm.reset();

            this.messageService.add({
              severity: 'success',
              summary: 'Welcome!',
              detail: 'Registration successful. Redirecting...',
              life: 2000,
            });

            // Redirect after 1.5 seconds so they see the success message
            setTimeout(() => {
              this.closeModalAndLogin();
            }, 1500);
          } else {
            // If backend requires email verification instead of auto-login
            this.verificationEmailSent.set(true);
            this.isEmailSent.set(true);
            // Also show the success modal so user knows what happened
            this.isRegistrationSuccessful.set(true);
          }
        },
        error: (err) => {
          // --- UNSUCCESSFUL FLOW ---
          console.error('Registration error:', err);

          // 1. Parse the error message
          let errorMessage = 'Registration failed. Please try again.';

          // Check for specific backend error structures
          if (err.error) {
            if (typeof err.error === 'string') errorMessage = err.error;
            else if (err.error.detail) errorMessage = err.error.detail;
            else if (err.error.message) errorMessage = err.error.message;
            // If it's a field specific error array (e.g. Django/DRF)
            else if (err.error.email) errorMessage = err.error.email[0];
            else if (err.error.phone) errorMessage = err.error.phone[0];
          }

          // Check specifically for OTP mismatch
          if (err.error?.otp || errorMessage.toLowerCase().includes('otp')) {
            errorMessage = 'Incorrect OTP. Please check and try again.';
          }

          // 2. UX: Clear the OTP input so they can type again immediately
          this.otpDigits = '';

          // 3. Set the error signal (to show inline in HTML if needed)
          this.serverError.set(errorMessage);

          // 4. Show a Toast Notification
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: errorMessage,
            life: 3000,
          });

          // CRITICAL: We do NOT call this.showOtpModal.set(false).
          // The modal stays open, allowing the user to click "Resend" or try typing again.
        },
      });
  }
  closeModalAndLogin(): void {
    this.isRegistrationSuccessful.set(false);
    this.router.navigate(['/login']);
  }
  onGoogleSignUp(): void {
    console.log('Google Sign Up clicked');
  }
}
