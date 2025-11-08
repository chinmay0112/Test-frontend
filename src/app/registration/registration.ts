import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

/* 1) Auth service se sahi cheezein import kari hai:
   - RegisterResponse type ko bhi yahin se laye hai taaki res ka type fix ho. */
import { Auth, RegisterResponse } from '../services/auth';

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
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'], // ✅ array form
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
    this.serverError.set(null);

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    // Clean payload
    const raw = this.registrationForm.getRawValue();
    const payload = {
      first_name: String(raw.first_name).trim(),
      last_name: String(raw.last_name).trim(),
      email: String(raw.email).trim().toLowerCase(),
      phone: String(raw.phone).trim(),
      password1: raw.password1 as string,
      password2: raw.password2 as string,
    };

    this.loading.set(true);

    this.auth
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        // 4) res ko type do -> implicit any hataya
        next: (res: RegisterResponse) => {
          if (res?.token || (res as any)?.access) {
            const token = res.token ?? (res as any).access;
            localStorage.setItem('token', token as string);
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/verify-email'], { queryParams: { email: payload.email } });
          }
        },
        // 5) err ko type do (any enough hai yahan)
        error: (err: any) => {
          const msg = err?.error?.message ?? err?.message ?? err;
          if (Array.isArray(msg)) {
            // Field-wise validation errors
            for (const e of msg) {
              if (e?.field && this.registrationForm.get(e.field)) {
                this.registrationForm.get(e.field)!.setErrors({ server: e.message });
              }
            }
            const top = msg.find((e: any) => !e?.field)?.message;
            if (top) this.serverError.set(top);
          } else {
            if (err?.status === 409) this.serverError.set('Account already exists.');
            else if (err?.status === 400 || err?.status === 422)
              this.serverError.set('Please fix the highlighted fields.');
            else this.serverError.set('Something went wrong. Please try again.');
          }
        },
      });
  }

  onGoogleSignUp(): void {
    console.log('Google Sign Up clicked');
  }
}
