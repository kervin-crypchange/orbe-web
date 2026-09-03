import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'auth/verify-email/:id',
    loadComponent: () => import('./pages/auth/verify-account/verify-account').then((m) => m.VerifyAccount),
  },
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
    loadChildren: () => import('./pages/landing/landing.routes').then((m) => m.landingRoutes),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then((m) => m.dashboarRoutes),
  },
];
