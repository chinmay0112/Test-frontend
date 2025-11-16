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
export const authConfig: AuthConfig = {
  // This is the URL for Google's "discovery document"
  // It tells the library all the URLs it needs (for login, tokens, etc.)
  issuer: 'https://accounts.google.com',

  // This MUST match the "Authorized redirect URI" in your Google Cloud Console
  // This is the page Google sends the user back to with the "valet key"
  redirectUri: 'http://localhost:4200/google-callback',

  // This is your "Client ID" from the Google Cloud Console
  // !! REPLACE THIS WITH YOUR REAL CLIENT ID !!
  clientId: '513830597696-3769ch6r4m755e2pgd2tir0jigooc9am.apps.googleusercontent.com',
  // These are the "permissions" you are asking for
  scope: 'openid profile email',

  // This tells the library to use the "Authorization Code Flow" (the "valet key")
  responseType: 'code',
};
export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
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
