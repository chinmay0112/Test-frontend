import { AsyncPipe, CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, SkeletonModule, MenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isMobileMenuOpen = false;
  isStudyMenuOpen = false; // For mobile toggle
  userMenuItems: MenuItem[] | undefined;

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
}
