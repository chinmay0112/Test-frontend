import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

declare var Razorpay: any;

@Component({
  selector: 'app-pricing-page',
  imports: [CommonModule],
  templateUrl: './pricing-page.html',
  styleUrl: './pricing-page.scss',
})
export class PricingPage {
  isYearly = false;

  constructor(private router: Router, private authService: Auth) {}

  ngOnInit(): void {}

  navigateTo(route: string): void {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
  }

  initiatePayment(planType: string) {
    const planId = this.isYearly ? 'pro_yearly' : 'pro_monthly'; // Replace with actual plan IDs
    this.authService.createRazorpayOrder(planId).subscribe({
      next: (order) => {
        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: 'PrepMaster',
          description: `Subscription for ${planType}`,
          order_id: order.order_id,
          handler: (response: any) => {
            this.verifyPayment(response);
          },
          prefill: {
            name: 'User Name', // You might want to get this from AuthService
            email: 'user@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#4F46E5',
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to initiate payment. Please try again.');
      },
    });
  }

  verifyPayment(response: any) {
    this.authService.verifyPayment(response).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          alert('Payment successful!');
          this.authService.fetchCurrentUser().subscribe();
          this.router.navigate(['/app/dashboard']);
        } else {
          alert('Payment verification failed.');
        }
      },
      error: (err) => {
        console.error('Payment verification error:', err);
        alert('Payment verification failed.');
      },
    });
  }
}
