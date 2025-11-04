import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { inject } from '@angular/core';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  if (!authService.isUserLoggedIn()) {
    return true;
  }

  router.navigate(['/app/dashboard']);
  return false;
};
