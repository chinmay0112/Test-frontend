import { Routes } from '@angular/router';

import { TestInterface } from './app-layout-component/test-interface/test-interface';
import { ResultComponent } from './result-component/result-component';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Home } from './home/home';
import { ForgotPassword } from './forgot-password/forgot-password';
import { authGuard } from './services/auth-guard';
import { publicGuard } from './services/public-guard';
import { GoogleCallback } from './pages/google-callback/google-callback';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';
import { PricingPage } from './app-layout-component/pricing-page/pricing-page';
import { TermsOfService } from './terms-of-service/terms-of-service';
import { VerifyEmail } from './pages/verify-email/verify-email';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'register', component: Registration, canActivate: [publicGuard] },
  { path: 'google-callback', component: GoogleCallback },
  { path: 'app/prices', component: PricingPage },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms-of-service', component: TermsOfService },
  { path: 'app/verify-email', component: VerifyEmail },

  {
    path: 'app',

    loadChildren: () => import('./app.authenticated-routes').then((m) => m.AUTHENTICATED_ROUTES),
    canActivate: [authGuard],
  },
];
