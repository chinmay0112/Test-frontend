import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { InputText, InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-complete-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, Toast, InputTextModule],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.scss',
  providers: [MessageService],
})
export class CompleteProfile {
  profileForm: any;
  isSubmitting = false;
  backendError = {
    phone: '',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.auth.currentUser.subscribe((user) => {
      if (!user) return;

      // 🟢 PRE-FILL FIRST + LAST NAME
      this.profileForm.patchValue({
        first_name: user['first_name'] || '',
        last_name: user['last_name'] || '',
        phone: '', // phone stays empty for Google users
      });
    });
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });
  }

  submitProfile() {
    this.backendError.phone = '';
    console.log('cliked');
    if (this.profileForm.invalid) {
      console.error('Profile is invalid');
      this.profileForm.markAllAsTouched();
      return;
    }
    console.log('Profile Data:', this.profileForm.value);

    this.isSubmitting = true;
    this.auth.completeProfile(this.profileForm.value).subscribe({
      next: (res) => {
        console.log('Profile updated:', res);
        this.isSubmitting = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSubmitting = false;
        if (err.error) {
          const backendMessage =
            err.error?.error || // your backend sends { error: "message" }
            err.error?.detail || // sometimes Django sends { detail: "message" }
            'Something went wrong';
          this.showError(backendMessage);
        }
      },
    });

    // TODO: Replace with actual API call
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
