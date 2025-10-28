import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  loginMode: 'email' | 'phone' = 'email'; // Track current mode
  otpSent = false; // Track if OTP has been sent

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize form with all possible controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]],
      phone: ['', [Validators.pattern('^[6-9]\\d{9}$')]], // Basic Indian mobile pattern
      otp: ['', [Validators.minLength(6), Validators.maxLength(6)]],
    });

    // Initial validation setup for email mode
    this.updateValidators();
  }

  ngOnInit(): void {}

  setLoginMode(mode: 'email' | 'phone'): void {
    if (this.loginMode === mode) return; // Do nothing if mode hasn't changed

    this.loginMode = mode;
    this.otpSent = false; // Reset OTP status when switching modes
    this.loginForm.reset(); // Clear form values when switching
    this.updateValidators(); // Update which fields are required
  }

  updateValidators(): void {
    const emailControl = this.loginForm.controls['email'];
    const passwordControl = this.loginForm.controls['password'];
    const phoneControl = this.loginForm.controls['phone'];
    const otpControl = this.loginForm.controls['otp'];

    if (this.loginMode === 'email') {
      emailControl.setValidators([Validators.required, Validators.email]);
      passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
      phoneControl.clearValidators();
      otpControl.clearValidators();
    } else {
      // Phone mode
      emailControl.clearValidators();
      passwordControl.clearValidators();
      phoneControl.setValidators([Validators.required, Validators.pattern('^[6-9]\\d{9}$')]);
      // OTP is only required *after* it's been sent
      otpControl.setValidators(
        this.otpSent
          ? [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
          : null
      );
    }

    // Update the validity of controls after changing validators
    emailControl.updateValueAndValidity();
    passwordControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();
    otpControl.updateValueAndValidity();
  }

  sendOtp(): void {
    if (this.loginForm.controls['phone'].valid) {
      console.log('Sending OTP to:', this.loginForm.value.phone);
      // --- HERE YOU WOULD CALL YOUR AuthService TO SEND OTP ---
      // this.authService.sendLoginOtp(this.loginForm.value.phone).subscribe(...)

      // Simulate OTP sent
      this.otpSent = true;
      this.updateValidators(); // Make OTP field required now
      alert('OTP Sent (simulation)');
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      if (this.loginMode === 'email') {
        console.log('Submitting Email/Password Login:', this.loginForm.value);
        // --- CALL AuthService for Email/Password login ---
        // this.authService.loginEmailPassword(this.loginForm.value.email, this.loginForm.value.password).subscribe(...)
      } else {
        // Phone mode
        console.log('Submitting Phone/OTP Login:', this.loginForm.value);
        // --- CALL AuthService for Phone/OTP verification ---
        // this.authService.verifyLoginOtp(this.loginForm.value.phone, this.loginForm.value.otp).subscribe(...)
      }
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched(); // Show validation errors
    }
  }
}
