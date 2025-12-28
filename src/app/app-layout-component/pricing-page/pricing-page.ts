import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Subscription, finalize } from 'rxjs';
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
  couponMessage: string = '';
  isCouponValid: boolean = false;
  couponCode: string = '';
  finalAmount: number = 299;
  isCheckingCoupon: boolean = false;
  isPaymentLoading: boolean = false;
  showCouponModal: boolean = false;
  // Constants (for easy math)
  originalPrice: number = 299;
  userSubscription: Subscription | undefined;
  constructor(
    private router: Router,
    public authService: Auth,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe((user) => {
      const isLoggedIn = this.authService.isUserLoggedIn();
      if (user) {
        this.loading = false;
        this.isProMember = !!user.is_pro_active;
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

  applyCoupon() {
    if (!this.couponCode.trim()) return;

    this.isCheckingCoupon = true;
    this.couponMessage = '';

    // Explicitly detect changes to show spinner immediately
    this.cdr.detectChanges();

    this.authService
      .verifyCoupon(this.couponCode)
      .pipe(
        finalize(() => {
          this.isCheckingCoupon = false;
          this.cdr.detectChanges(); // FORCE UI Update when API finishes
        })
      )
      .subscribe({
        next: (res) => {
          if (res && res.valid) {
            this.isCouponValid = true;
            this.finalAmount = res.final_price;
            this.showCouponModal = true;
            this.couponMessage = res.message;
          } else {
            this.handleInvalidCoupon(res?.message);
          }
        },
        error: (err) => {
          this.handleInvalidCoupon(err.error?.message);
        },
      });
  }
  private handleInvalidCoupon(msg: string = 'Invalid Coupon Code') {
    this.isCouponValid = false;
    this.finalAmount = this.originalPrice;
    this.couponMessage = msg;
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
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const codeToTrack = this.isCouponValid ? this.couponCode : undefined;
    this.isPaymentLoading = true;
    const planId = 'pro_yearly';
    this.authService.createRazorpayOrder(planId, codeToTrack).subscribe({
      next: (order) => {
        // Keep loading true while modal is opening/open
        // this.isPaymentLoading = false;

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
              this.verifyPayment(response, codeToTrack);
            });
          },
          modal: {
            ondismiss: () => {
              this.ngZone.run(() => {
                console.log('Payment cancelled/modal closed');
                this.isPaymentLoading = false;
                this.cdr.detectChanges();
              });
            },
          },
          prefill: {
            name: '', // You might want to get this from AuthService
            email: order.user_email,
            contact: '',
          },
          theme: {
            color: '#4F46E5',
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();

        // Handle Razorpay modal close (if possible) to reset loading if we didn't reset above.
        // For now, resetting above 'next' block is simplest UX so button is clickable if they cancel.
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to initiate payment. Please try again.');
        this.isPaymentLoading = false;
      },
    });
  }

  verifyPayment(response: any, couponCode?: string) {
    console.log('Verifying payment with response:', response);
    this.paymentId = response.razorpay_payment_id;
    this.loading = true; // Show skeleton while verifying
    this.cdr.detectChanges();
    this.authService.verifyPayment(response, couponCode).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log('Payment verification successful, showing modal');
          this.showSuccessModal = true;
          this.authService.fetchCurrentUser().subscribe();
          this.isProMember = true;
          this.isCouponValid = false;
          this.couponCode = '';
          this.isPaymentLoading = false; // Stop spinner
          this.loading = false;
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
