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
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};
@Component({
  selector: 'app-account-settings-page',
  imports: [CommonModule, AvatarModule, TagModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './account-settings-page.html',
  styleUrl: './account-settings-page.scss',
})
export class AccountSettingsPage {
  activeTab = 'profile'; // Default tab
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // --- Profile Form ---
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
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
    // In a real app, you would fetch this user data from your AuthService or an API
    const mockUserData = {
      fullName: 'Aryan Sharma',
      username: 'aryan_sharma',
      email: 'aryan@example.com',
      phone: '9876543210',
    };

    // Pre-fill the profile form with user data
    this.profileForm.patchValue(mockUserData);
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
}
