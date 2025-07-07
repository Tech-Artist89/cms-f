import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule), canActivate: [AuthGuard] },
  { path: 'quotes', loadChildren: () => import('./quotes/quotes.module').then(m => m.QuotesModule), canActivate: [AuthGuard] },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule), canActivate: [AuthGuard] },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule), canActivate: [AuthGuard] },
  { path: 'timetracking', loadChildren: () => import('./timetracking/timetracking.module').then(m => m.TimetrackingModule), canActivate: [AuthGuard] },
  { path: 'schedules', loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule), canActivate: [AuthGuard] },
  { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
