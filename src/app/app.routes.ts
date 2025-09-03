import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';
import { Leave } from './pages/leave/leave';
import { Layout } from './pages/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },

      {
        path: 'employee',
        component: Employee,
      },

      {
        path: 'leave',
        component: Leave,
      },
    ],
  },
];
