import { Routes } from '@angular/router';

import { TestInterface } from './test-interface/test-interface';
import { ResultComponent } from './result-component/result-component';
import { Dashboard } from './app-layout-component/dashboard/dashboard';
import { AppLayoutComponent } from './app-layout-component/app-layout-component';
import { MyTestSeries } from './app-layout-component/my-test-series/my-test-series';
import { TestLists } from './app-layout-component/test-lists/test-lists';
import { AccountSettingsPage } from './app-layout-component/account-settings-page/account-settings-page';
import { CompleteProfile } from './pages/complete-profile/complete-profile';
import { Catalog } from './app-layout-component/catalog/catalog';

export const AUTHENTICATED_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent, // <-- The "Shell" with the persistent Header
    // canActivate: [authGuard], // Protects all child routes
    children: [
      { path: 'dashboard', component: Dashboard },
      // { path: 'my-tests', component: MyTestSeries },
      { path: 'tests', component: TestLists },
      // { path: 'prices', component: PricingPage },
      { path: 'test-series/:id', component: TestLists },
      { path: 'results', component: ResultComponent },
      { path: 'settings', component: AccountSettingsPage },
      { path: 'catalog', component: Catalog },

      // { path: 'analysis', component: AnalysisComponent },

      // Default route for '/app' is to redirect to the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'test/:id', component: TestInterface },
  { path: 'complete-profile', component: CompleteProfile },
];
