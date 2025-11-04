import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      console.log('Forgot password form submitted:', this.forgotPasswordForm.value);
      // Here you would call your AuthService to send the password reset link
      // this.authService.sendPasswordReset(this.forgotPasswordForm.value.email).subscribe(...)

      // Optionally, navigate to a confirmation page or show a success message
      alert('Password reset link sent! Please check your email.');
      this.router.navigate(['/login']);
    } else {
      // Mark fields as touched to show errors if not already shown
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
