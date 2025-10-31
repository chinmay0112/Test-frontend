import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginFormUsingEmail: FormGroup;
  loginFormUsingPhone: FormGroup;
  loginMode: 'email' | 'phone' = 'email'; // Track current mode
  otpSent = false; // Track if OTP has been sent

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
    const email = this.loginFormUsingEmail.value.email;
    const password = this.loginFormUsingEmail.value.password;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        console.log('Login Successful', res);
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
