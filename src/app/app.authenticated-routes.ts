import { Routes } from '@angular/router';

import { TestInterface } from './app-layout-component/test-interface/test-interface';
import { ResultComponent } from './result-component/result-component';
import { Dashboard } from './app-layout-component/dashboard/dashboard';
import { AppLayoutComponent } from './app-layout-component/app-layout-component';
import { MyTestSeries } from './app-layout-component/my-test-series/my-test-series';
import { TestLists } from './app-layout-component/test-lists/test-lists';
import { AccountSettingsPage } from './app-layout-component/account-settings-page/account-settings-page';
import { CompleteProfile } from './pages/complete-profile/complete-profile';
import { Catalog } from './app-layout-component/catalog/catalog';
import { Analysis } from './app-layout-component/analysis/analysis';
import { ComingSoon } from './app-layout-component/coming-soon/coming-soon';
import { DailyCurrentAffairs } from './app-layout-component/daily-current-affairs/daily-current-affairs';
import { AllResults } from './app-layout-component/all-results/all-results';
import { VerifyEmail } from './pages/verify-email/verify-email';
export const AUTHENTICATED_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent, // <-- The "Shell" with the persistent Header
    // canActivate: [authGuard], // Protects all child routes
    children: [
      { path: 'dashboard', component: Dashboard },
      // { path: 'my-tests', component: MyTestSeries },
      { path: 'profile', component: AccountSettingsPage },
      { path: 'tests', component: TestLists },
      { path: 'test-series/:id', component: TestLists },
      { path: 'results/:id', component: ResultComponent },
      { path: 'settings', component: AccountSettingsPage },
      { path: 'catalog', component: Catalog },
      { path: 'daily-current-affairs', component: DailyCurrentAffairs },
      { path: 'all-results', component: AllResults },
      // { path: 'analysis', component: AnalysisComponent },

      // Default route for '/app' is to redirect to the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'analysis/:id', component: Analysis },
  { path: 'coming-soon', component: ComingSoon },
  { path: 'test/:id', component: TestInterface },
  { path: 'complete-profile', component: CompleteProfile },
];
