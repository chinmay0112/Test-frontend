import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth-interceptor';
import { AuthConfig, OAuthModule, provideOAuthClient } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',

  redirectUri: `https://examprepare.netlify.app/google-callback`,

  clientId: '513830597696-3769ch6r4m755e2pgd2tir0jigooc9am.apps.googleusercontent.com',

  scope: 'openid profile email',

  responseType: 'code',
};
export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideOAuthClient(),
    provideAnimationsAsync(),
  ],
};
