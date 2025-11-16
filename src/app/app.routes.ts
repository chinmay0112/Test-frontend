import { Routes } from '@angular/router';

import { TestInterface } from './test-interface/test-interface';
import { ResultComponent } from './result-component/result-component';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Home } from './home/home';
import { ForgotPassword } from './forgot-password/forgot-password';
import { authGuard } from './services/auth-guard';
import { publicGuard } from './services/public-guard';
import { GoogleCallback } from './pages/google-callback/google-callback';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'register', component: Registration, canActivate: [publicGuard] },
  { path: 'google-callback', component: GoogleCallback },

  {
    path: 'app',

    loadChildren: () => import('./app.authenticated-routes').then((m) => m.AUTHENTICATED_ROUTES),
    canActivate: [authGuard],
  },
];
