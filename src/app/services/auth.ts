import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // --- Mock State ---
  // Use BehaviorSubject to make the login status reactive.
  // Initialize to 'false' (logged out).
  private loggedInStatus = new BehaviorSubject<boolean>(false);

  // Expose the login status as an Observable so components can subscribe.
  isLoggedIn$: Observable<boolean> = this.loggedInStatus.asObservable();

  // Store mock user data (can be null if logged out)
  private mockUser: { firstName: string; email: string } | null = null;

  constructor() {
    // Check localStorage in case of page refresh during testing
    // In a real app, you'd validate the token here.
    if (localStorage.getItem('mock_logged_in') === 'true') {
      this.loggedInStatus.next(true);
      this.mockUser = { firstName: 'Aryan', email: 'aryan@example.com' };
    }
  }

  // --- Mock Methods ---

  /**
   * Simulates a successful login.
   * In a real service, this would make an API call and save tokens.
   */
  login(credentials: any): Observable<any> {
    console.log('AuthService (Mock): Logging in with', credentials);
    // Simulate success
    this.loggedInStatus.next(true);
    this.mockUser = { firstName: 'Aryan', email: credentials.email || 'aryan@example.com' };
    localStorage.setItem('mock_logged_in', 'true'); // Simulate session persistence

    // Return an Observable that completes immediately (like a successful HTTP request)
    return of({ success: true, message: 'Mock login successful' });
  }

  /**
   * Simulates registration.
   * In a real service, this would make an API call.
   */
  register(userData: any): Observable<any> {
    console.log('AuthService (Mock): Registering user', userData);
    // Simulate success
    // Optionally, log the user in immediately after registration
    // return this.login(userData);
    return of({ success: true, message: 'Mock registration successful' });
  }

  /**
   * Simulates logging out.
   * In a real service, this might call a logout API and clear tokens.
   */
  logout(): void {
    console.log('AuthService (Mock): Logging out');
    this.loggedInStatus.next(false);
    this.mockUser = null;
    localStorage.removeItem('mock_logged_in'); // Clear simulated session
    // You would typically navigate to the login page here via the Router
  }

  /**
   * Returns the current mock login status directly.
   * Components can use this for simple checks in their templates.
   */
  isUserLoggedIn(): boolean {
    return this.loggedInStatus.value;
  }

  /**
   * Returns the mock user data if logged in.
   */
  getCurrentUser(): { firstName: string; email: string } | null {
    return this.mockUser;
  }

  // --- You would add other methods like sendPasswordReset later ---
}
