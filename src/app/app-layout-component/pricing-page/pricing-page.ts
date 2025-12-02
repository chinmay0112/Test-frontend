import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Subscription } from 'rxjs';
import { Header } from '../../components/header/header';
import { ModalComponent } from '../../components/modal/modal';

import { SkeletonModule } from 'primeng/skeleton';

declare var Razorpay: any;

@Component({
  selector: 'app-pricing-page',
  imports: [CommonModule, FormsModule, Header, ModalComponent, SkeletonModule],
  templateUrl: './pricing-page.html',
  styleUrl: './pricing-page.scss',
})
export class PricingPage implements OnInit, OnDestroy {
  showSuccessModal = false;
  paymentId: string = '';
  isProMember = false;
  loading = true;

  // Constants (for easy math)
  readonly MONTHLY_PRICE = 249;
  readonly YEARLY_PRICE = 2399;
  userSubscription: Subscription | undefined;
  constructor(private router: Router, public authService: Auth, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe((user) => {
      const isLoggedIn = this.authService.isUserLoggedIn();
      if (user) {
        this.loading = false;
        this.isProMember = !!user.is_pro_member;
      } else {
        // If logged in but user is null, we are still fetching.
        // If not logged in, we are done (guest).
        if (isLoggedIn) {
          this.loading = true;
        } else {
          this.loading = false;
          this.isProMember = false;
        }
      }
    });
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  navigateTo(route: string): void {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
  }

  initiatePayment(planType: string) {
    const planId = 'pro_yearly';
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
            this.ngZone.run(() => {
              console.log('Razorpay payment success callback received', response);
              this.verifyPayment(response);
            });
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
    console.log('Verifying payment with response:', response);
    this.paymentId = response.razorpay_payment_id;
    this.loading = true; // Show skeleton while verifying
    this.authService.verifyPayment(response).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log('Payment verification successful, showing modal');
          this.showSuccessModal = true;
          this.authService.fetchCurrentUser().subscribe();
          // this.router.navigate(['/app/dashboard']);
        } else {
          alert('Payment verification failed.');
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Payment verification error:', err);
        alert('Payment verification failed.');
        this.loading = false;
      },
    });
  }
  closeModalAndNavigate() {
    this.showSuccessModal = false;
    this.router.navigate(['/app/dashboard']);
  }
}
