import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/enums';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  {
    path: 'jobs',
    loadComponent: () => import('./components/jobs/job-list.component').then(m => m.JobListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'candidates',
    loadComponent: () => import('./components/candidates/candidate-list.component').then(m => m.CandidateListComponent),
    canActivate: [roleGuard],
    data: { roles: [UserRole.HR, UserRole.Manager] }
  },
  {
    path: 'applications',
    loadComponent: () => import('./components/applications/application-list.component').then(m => m.ApplicationListComponent),
    canActivate: [roleGuard],
    data: { roles: [UserRole.HR, UserRole.Manager] }
  },
  {
    path: 'interviews',
    loadComponent: () => import('./components/interviews/interview-list.component').then(m => m.InterviewListComponent),
    canActivate: [roleGuard],
    data: { roles: [UserRole.HR, UserRole.Manager] }
  },
  { path: 'unauthorized', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
