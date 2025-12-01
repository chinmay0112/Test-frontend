import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { AuthApi } from '../services/auth-api';
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

// Helper function to add the token to a request
function addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthApi);
  const authToken = localStorage.getItem('access_token');

  // 1. Attach the current "Day Pass" (access token)
  if (authToken) {
    req = addTokenToRequest(req, authToken);
  }

  // 2. Send the request and prepare to catch errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 3. Check if it's the "Expired Pass" error (401)

      if (error.status === 401) {
        if (req.url.includes('/auth/token/refresh/')) {
          isRefreshing = false;
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return throwError(() => error);
        }
        // 4. Check if we're already in the process of getting a new pass
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null); // Lock other requests
          const refresh = localStorage.getItem('refresh_token');
          if (!refresh) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login'; // optional redirect
            return throwError(() => new Error('No refresh token'));
          }

          // 5. Go to the "Front Desk" using the "VIP Wristband"
          return authService.refreshToken(refresh).pipe(
            switchMap((newTokens: any) => {
              // 6. Refresh was successful!
              console.log('Refresh successful:', newTokens);
              isRefreshing = false;
              localStorage.setItem('access_token', newTokens.access);
              if (newTokens.refresh) {
                localStorage.setItem('refresh_token', newTokens.refresh);
              }
              refreshTokenSubject.next(newTokens.access); // Unlock other requests

              // 7. Re-try the original, failed request with the NEW pass
              return next(addTokenToRequest(req, newTokens.access));
            }),
            catchError((refreshError) => {
              // 8. The "VIP Wristband" itself is bad. Log the user out.
              isRefreshing = false;
              console.error('Token refresh failed:', refreshError);
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login'; // redirect user to login page

              return throwError(() => refreshError);
            })
          );
        } else {
          // 9. We are already refreshing. Wait for the new pass and retry.
          return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((jwt) => next(addTokenToRequest(req, jwt)))
          );
        }
      }

      // 10. If it was any other error (not a 401), just fail.
      return throwError(() => error);
    })
  );
};
