import { AsyncPipe, CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, SkeletonModule, MenuModule, PopoverModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isMobileMenuOpen = false;
  isStudyMenuOpen = false; // For mobile toggle
  userMenuItems: MenuItem[] | undefined;

  // Mock Notifications
  notifications = [
    {
      id: 1,
      title: 'New Test Series Added',
      message: 'UPSC Prelims 2025 Booster Pack is now available.',
      time: '2 hours ago',
      icon: 'pi pi-book',
      color: 'bg-indigo-100 text-indigo-600',
      read: false,
    },
    {
      id: 2,
      title: 'Result Announced',
      message: 'Your result for "History Mock Test 5" has been published.',
      time: '5 hours ago',
      icon: 'pi pi-chart-bar',
      color: 'bg-green-100 text-green-600',
      read: false,
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Platform maintenance scheduled for tonight at 2 AM.',
      time: '1 day ago',
      icon: 'pi pi-cog',
      color: 'bg-orange-100 text-orange-600',
      read: true,
    },
  ];

  get unreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  constructor(public authService: Auth, private router: Router) {}

  ngOnInit() {
    this.userMenuItems = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => {
          this.navigateTo('/app/profile');
        },
      },
      {
        label: 'My Results',
        icon: 'pi pi-chart-bar',
        command: () => {
          this.navigateTo('/app/results');
        },
      },
      {
        label: 'Subscription Plans',
        icon: 'pi pi-star',
        command: () => {
          this.navigateTo('/app/prices');
        },
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
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

  markAsRead() {
    this.notifications.forEach((n) => (n.read = true));
  }

  clearNotifications() {
    this.notifications = [];
  }
}
