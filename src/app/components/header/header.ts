import { AsyncPipe, CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component, inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, SkeletonModule, MenuModule, PopoverModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isStudyMenuOpen = false; // For mobile toggle
  userMenuItems: MenuItem[] | undefined;
  private notifSub: Subscription | undefined;
  // Mock Notifications
  notifications: any[] = [];

  get unreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  constructor(public authService: Auth, private router: Router) {}

  ngOnInit() {
    // 1. Initial Fetch
    this.fetchNotifications();

    // 2. Optional: Poll every 60 seconds for new notifications
    // Only if user is logged in
    this.notifSub = interval(60000).subscribe(() => {
      if (this.authService.currentUser.value) {
        // Assuming you have a signal for user
        this.fetchNotifications();
      }
    });
  }

  ngOnDestroy() {
    if (this.notifSub) this.notifSub.unsubscribe();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Reset subsections when closing
    if (!this.isMobileMenuOpen) {
      this.isStudyMenuOpen = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.isStudyMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  fetchNotifications() {
    this.authService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (err) => console.error('Failed to load notifications', err),
    });
  }

  markAsRead() {
    // Optimistic Update: Update UI immediately
    this.notifications.forEach((n) => (n.is_read = true));

    // Send request to backend
    this.authService.markNotificationsAsRead().subscribe();
  }

  clearNotifications() {
    this.notifications = [];
    this.authService.clearNotifications().subscribe();
  }
}
