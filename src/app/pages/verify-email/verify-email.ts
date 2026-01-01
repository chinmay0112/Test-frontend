import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail {
  status = 'Verifying...';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // 1. Get the token from the URL (?token=xyz)
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      // 2. Send it back to backend to confirm
      this.http
        .post('https://test-backend-qb46.onrender.com/api/auth/verify-email/', { token })
        .subscribe({
          next: () => {
            this.status = 'Success! Email verified.';
            setTimeout(() => this.router.navigate(['/app/dashboard']), 3000);
          },
          error: () => {
            this.status = 'Verification failed or link expired.';
          },
        });
    } else {
      this.status = 'Invalid link.';
    }
  }
}
