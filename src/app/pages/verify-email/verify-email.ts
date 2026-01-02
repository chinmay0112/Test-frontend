import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail {
  status: 'loading' | 'success' | 'error' = 'loading';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Get the token from the URL (?token=xyz)
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      // 2. Send it back to backend to confirm
      this.http
        .post('https://test-backend-qb46.onrender.com/api/auth/verify-email/', { token })
        .subscribe({
          next: () => {
            this.status = 'success';
            this.cd.detectChanges();
            // setTimeout(() => this.router.navigate(['/app/dashboard']), 3000);
          },
          error: () => {
            this.status = 'error';
          },
        });
    } else {
      this.status = 'error';
    }
  }
}
