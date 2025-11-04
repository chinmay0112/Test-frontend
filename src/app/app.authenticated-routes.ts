import { Routes } from '@angular/router';

import { TestInterface } from './test-interface/test-interface';
import { ResultComponent } from './result-component/result-component';
import { Dashboard } from './app-layout-component/dashboard/dashboard';
import { AppLayoutComponent } from './app-layout-component/app-layout-component';
import { MyTestSeries } from './app-layout-component/my-test-series/my-test-series';
import { TestLists } from './app-layout-component/test-lists/test-lists';
import { TestSeriesCatalog } from './app-layout-component/test-series-catalog/test-series-catalog';
import { PricingPage } from './app-layout-component/pricing-page/pricing-page';
import { AccountSettingsPage } from './app-layout-component/account-settings-page/account-settings-page';

export const AUTHENTICATED_ROUTES: Routes = [
  {
    path: '',
    component: AppLayoutComponent, // <-- The "Shell" with the persistent Header
    // canActivate: [authGuard], // Protects all child routes
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'my-tests', component: MyTestSeries },
      { path: 'tests', component: TestLists },
      { path: 'prices', component: PricingPage },
      { path: 'all-tests', component: TestSeriesCatalog },
      { path: 'results', component: ResultComponent },
      { path: 'settings', component: AccountSettingsPage },
      // { path: 'analysis', component: AnalysisComponent },

      // Default route for '/app' is to redirect to the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'app/test/:id', component: TestInterface },
];
