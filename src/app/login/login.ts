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
  isLoading: boolean = false;
  loginError: any = null;

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.loginFormUsingEmail = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

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

  loginWithGoogle(): void {
    console.log('Google clicked');
    this.isLoading = true; // Show spinner
    this.auth.loginWithGoogle();
  }
}
