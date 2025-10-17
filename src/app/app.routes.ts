import { Routes } from '@angular/router';

import { Comp2 } from './comp2/comp2';
import { TestInterface } from './test-interface/test-interface';

export const routes: Routes = [
  { path: '2', component: Comp2 },
  { path: 'test', component: TestInterface },
];
