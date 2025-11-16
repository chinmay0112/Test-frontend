import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  imports: [],
  templateUrl: './google-callback.html',
  styleUrl: './google-callback.scss',
})
export class GoogleCallback {
  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute // 2. Inject ActivatedRoute to read the URL
  ) {}

  ngOnInit(): void {
    // 3. This component's job is to read the "valet key" (code) from the URL
    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      // Handle the case where the user denied permission
      console.error('Google login error:', error);
      this.router.navigate(['/login']);
      return;
    }

    if (code) {
      // 4. We found the code. Now we send it to our service to exchange.
      this.authService.handleGoogleCallback(code).subscribe({
        next: (res) => {
          // Success! The backend gave us tokens. Go to the dashboard.
          if (res.needs_profile) {
            this.router.navigate(['app/complete-profile']);
          } else {
            this.router.navigate(['/app/dashboard']);
          }
        },
        error: (err) => {
          // Failed. The backend couldn't exchange the code. Send back to login.
          console.error('Backend Google login failed', err);
          this.router.navigate(['/login']);
        },
      });
    } else {
      // No code was found in the URL. This is an unexpected error.
      console.error('No code found in Google callback');
      this.router.navigate(['/login']);
    }
  }
}
