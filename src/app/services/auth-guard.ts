import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isUserLoggedIn()) {
    return true; //access granted
  }
  router.navigate(['/login']);
  return false; //access denied
};
