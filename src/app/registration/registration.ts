import { Component, inject, signal } from '@angular/core';
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

/* 1) Auth service se sahi cheezein import kari hai:
   - RegisterResponse type ko bhi yahin se laye hai taaki res ka type fix ho. */
import { Auth } from '../services/auth';

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
  imports: [ReactiveFormsModule, RouterLink, CommonModule, InputOtpModule, FormsModule],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
})
export class Registration {
  // 2) NonNullableFormBuilder -> safer controls (no null)
  private fb = inject(FormBuilder).nonNullable;
  private router = inject(Router);

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
  otpDigits: string[] = ['', '', '', '', '', ''];
  timeLeft: number = 30;
  showResend: boolean = false;

  isRegistrationSuccessful = false;

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
    this.auth.register(this.registrationForm.value).subscribe({
      next: (res) => {
        this.isRegistrationSuccessful = true;
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Stubs for verification flow
  sendVerificationMail(): void {
    console.log('Sending verification mail...');
  }

  // Stubs for OTP flow
  onOtpInput(index: number, event: any): void {
    console.log('OTP Input', index, event);
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    console.log('Key Down', index, event);
  }

  onPaste(event: ClipboardEvent): void {
    console.log('Paste', event);
  }

  sendOtp(): void {
    this.auth.sendOtp(this.registrationForm.value.phone).subscribe({
      next: (res) => {
        console.log('OTP Sent');
      },
      error: (err) => alert('Failed to send OTP'),
    });
  }

  verifyOtp(): void {
    console.log('Verify OTP');
  }

  closeModalAndLogin(): void {
    this.isRegistrationSuccessful = false;
    this.router.navigate(['/login']);
  }
  onGoogleSignUp(): void {
    console.log('Google Sign Up clicked');
  }
}
