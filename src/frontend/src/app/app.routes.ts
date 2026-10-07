import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'properties',
    canActivate: [authGuard],
    loadComponent: () => import('./features/properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'contracts',
    canActivate: [authGuard],
    loadComponent: () => import('./features/contracts/contracts.component').then(m => m.ContractsComponent)
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () => import('./features/payments/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'currencies',
    canActivate: [authGuard],
    loadComponent: () => import('./features/currencies/currencies.component').then(m => m.CurrenciesComponent)
  },
  { path: 'profile', canActivate:[authGuard], loadComponent:()=>import('./features/profile/profile.component').then(m=>m.ProfileComponent) },
  {
    path: 'portal',
    canActivate: [authGuard],
    loadComponent: () => import('./features/portal/portal.component').then(m => m.PortalComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: 'login' }
];
