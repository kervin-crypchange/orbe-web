import { Routes } from '@angular/router';
import { ERole } from '@core/enums';
import { authGuard } from '@core/guards/auth.guard';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { Store } from '@ngxs/store';
import { inject } from '@angular/core';

export const dashboarRoutes: Routes = [
  {
    path: '',
    title: 'Resumen General',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin, ERole.User] },
    loadComponent: async () => {
      const userRole = inject(Store).selectSnapshot(AuthSelectors.userRole);
      if (userRole === ERole.Admin) {
        const m = await import('./home/home');
        return m.Home;
      } else if (userRole === ERole.User) {
        const m_1 = await import('./home/home-client/home-client');
        return m_1.HomeClient;
      } else if (userRole === ERole.Advisor) {
        const m_2 = await import('./home/home-advisor/home-advisor');
        return m_2.HomeAdvisor;
      } else {
        const m_3 = await import('./home/home');
        return m_3.Home;
      }
    },
  },
  {
    path: 'admin',
    title: 'Mi perfil',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin, ERole.User, ERole.Advisor] },
    loadComponent: async () => {
      const userRole = inject(Store).selectSnapshot(AuthSelectors.userRole);
      if (userRole === ERole.Admin) {
        const m = await import('./home/home');
        return m.Home;
      } else if (userRole === ERole.User) {
        const m_1 = await import('./home/home-client/home-client');
        return m_1.HomeClient;
      } else if (userRole === ERole.Advisor) {
        const m_2 = await import('./home/home-advisor/home-advisor');
        return m_2.HomeAdvisor;
      } else {
        const m_3 = await import('./home/home');
        return m_3.Home;
      }
    },
  },
  {
    path: 'home',
    title: 'Resumen General',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'users',
    title: 'Usuarios',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./users/users').then((m) => m.Users),
    loadChildren: () => import('./users/user.routes').then((m) => m.userRoutes),
  },

  {
    path: 'categories',
    title: 'Categorías',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./categories/categories').then((m) => m.Categories),
  },
  {
    path: 'banks',
    title: 'Bancos',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./banks/banks').then((m) => m.Banks),
  },
  {
    path: 'bank-accounts',
    title: 'Cuentas Bancarias',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./bank-accounts/bank-accounts').then((m) => m.BankAccounts),
  },
  {
    path: 'legals',
    title: 'Legales',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./legals/legals').then((m) => m.Legals),
  },
  {
    path: 'plans',
    title: 'Planes',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./plans/plans').then((m) => m.Plans),
  },
  {
    path: 'transactions',
    title: 'Transacciones',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./transactions/transactions').then((m) => m.Transactions),
  },
  {
    path: 'advisor-payments',
    title: 'Pago a asesores',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./advisor-payments/advisor-payments').then((m) => m.AdvisorPayments),
  },
  {
    path: 'chats',
    title: 'Chats',
    canActivate: [authGuard],
    data: { roles: [ERole.Admin] },
    loadComponent: () => import('./chats/chats').then((m) => m.Chats),
  },
];
