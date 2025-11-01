import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, RouterModule, ProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginFormUsingEmail: FormGroup;
  loginFormUsingPhone: FormGroup;
  loginMode: 'email' | 'phone' = 'email'; // Track current mode
  otpSent = false; // Track if OTP has been sent
  isLoading: boolean = false;
  loginError: any = null;
  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    // Initialize form with all possible controls
    this.loginFormUsingEmail = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
    this.loginFormUsingPhone = this.fb.group({
      phone: ['', [Validators.pattern('^[6-9]\\d{9}$')]], // Basic Indian mobile pattern
      otp: ['', [Validators.minLength(6), Validators.maxLength(6)]],
    });
    // Initial validation setup for email mode
  }

  ngOnInit(): void {}

  setLoginMode(mode: 'email' | 'phone'): void {
    if (this.loginMode === mode) return; // Do nothing if mode hasn't changed

    this.loginMode = mode;
    this.otpSent = false; // Reset OTP status when switching modes
    this.loginFormUsingEmail.reset(); // Clear form values when switching
  }

  sendOtp(): void {}

  onSubmitusingEmail(): void {
    this.isLoading = true;
    this.loginError = null;
    const email = this.loginFormUsingEmail.value.email;
    const password = this.loginFormUsingEmail.value.password;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        console.log('Login Successful', res);
        this.isLoading = false;
        this.router.navigate(['/app/dashboard'], { replaceUrl: true });
        this.loginFormUsingEmail.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);

        if (err.status === 401) {
          this.loginError = err.error.detail || 'Invalid email or password.';
        } else {
          this.loginError = 'An unknown error occurred. Please try again.';
        }
      },
    });
  }
}
