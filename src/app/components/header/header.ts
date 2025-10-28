import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMobileMenuOpen = false; // State for mobile menu

  constructor(private router: Router) {}
  authService = inject(Auth);

  ngOnInit(): void {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu(); // Close menu on navigation
  }

  // --- Mobile Menu Logic ---
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
  logout() {
    console.log('Logged out');
  }
}
