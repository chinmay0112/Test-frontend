import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMobileMenuOpen = false; // State for mobile menu

  constructor(private router: Router, public authService: Auth) {}

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
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }
}
