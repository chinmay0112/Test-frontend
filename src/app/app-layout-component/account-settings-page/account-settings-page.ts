import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Auth } from '../../services/auth';
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account-settings-page',
  imports: [
    CommonModule,
    AvatarModule,
    TagModule,
    ReactiveFormsModule,
    InputTextModule,
    SkeletonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './account-settings-page.html',
  styleUrl: './account-settings-page.scss',
})
export class AccountSettingsPage {
  activeTab = 'profile'; // Default tab
  profileForm: FormGroup;
  passwordForm: FormGroup;
  verificationLoading = false;
  verificationSent = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: Auth,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    // --- Profile Form ---
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }], // Make email read-only
      phone: ['', Validators.required],
    });

    // --- Password Form ---
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Fetch real user data
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user['first_name'],
          lastName: user['last_name'],
          email: user.email,
          phone: user['phone'],
        });
      }
    });
  }

  /**
   * Sets the active tab for navigation
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Gets the Tailwind classes for the navigation buttons
   */
  getNavClass(tab: string): string {
    const baseClass =
      'w-full text-left p-3 rounded-lg font-medium flex items-center transition-colors duration-200';
    if (this.activeTab === tab) {
      return baseClass + ' bg-indigo-50 text-indigo-700';
    }
    return baseClass + ' text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  }

  /**
   * Handles profile form submission
   */
  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile update submitted:', this.profileForm.getRawValue());
      // In a real app:
      // this.authService.updateProfile(this.profileForm.value).subscribe(...)
      alert('Profile updated successfully! (Mock)');
      this.profileForm.markAsPristine(); // Mark as 'not dirty'
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  /**
   * Handles password change form submission
   */
  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      console.log('Password change submitted:', this.passwordForm.value);
      // In a real app:
      // this.authService.changePassword(this.passwordForm.value).subscribe(...)
      alert('Password changed successfully! (Mock)');
      this.passwordForm.reset();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
  requestVerification() {
    this.verificationLoading = true;

    this.http.post(`${environment.apiUrl}/api/auth/request-verification/`, {}).subscribe({
      next: (res: any) => {
        this.verificationLoading = false;
        this.verificationSent = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Verification Sent',
          detail: 'Check your email inbox for the verification link.',
        });

        // Optional: Reset button after 30 seconds to allow retry
        setTimeout(() => (this.verificationSent = false), 30000);
      },
      error: (err) => {
        this.verificationLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not send verification email. Try again later.',
        });
        console.error(err);
      },
    });
  }
}
