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
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
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
    ButtonModule,
    TooltipModule,
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
  isEmailEditing = false;
  saveLoading = false;
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
      phone: [{ value: '', disabled: true }, Validators.required],
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
        // Only patch if we are not currently saving to avoid overwriting optimistic updates or causing race conditions
        // Actually, if the save is successful, we WANT to patch with the new data.
        // The issue 'UI doesn't update' suggests the subscription might not be triggering or the object reference isn't changing enough for Angular CD.
        // But let's first ensure we don't fight with the form.
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
      this.saveLoading = true;
      const payload = {
        first_name: this.profileForm.value.firstName, // Send as first_name
        last_name: this.profileForm.value.lastName, // Send as last_name
        phone: this.profileForm.value.phone,
        email: this.profileForm.value.email,
      };
      this.authService.updateProfile(payload).subscribe({
        next: () => {
          this.saveLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Your profile details have been saved successfully.',
          });
          this.profileForm.markAsPristine();

          if (this.isEmailEditing) {
            this.toggleEmailEdit(); // Disable editing mode if active
          }
        },
        error: (err) => {
          this.saveLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err?.error.error || 'Something went wrong. Please try again.',
          });
        },
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  /**
   * Handles password change form submission
   */

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

  toggleEmailEdit() {
    this.isEmailEditing = !this.isEmailEditing;
    const emailControl = this.profileForm.get('email');
    if (this.isEmailEditing) {
      emailControl?.enable();
    } else {
      emailControl?.disable();
    }
  }
  // account-settings-page.ts

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.currentPassword === this.passwordForm.value.newPassword) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid Password',
          detail: 'New password cannot be the same as the current password.',
        });
        return;
      }

      this.saveLoading = true; // Re-use the loading spinner

      const payload = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
      };

      this.authService.changePassword(payload).subscribe({
        next: () => {
          this.saveLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your password has been changed successfully.',
          });

          // Clear the form for security
          this.passwordForm.reset();
        },
        error: (err) => {
          this.saveLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.error || 'Failed to change password.',
          });
        },
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
