import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainLayoutComponent } from './components/layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/enums';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        component: DashboardComponent
      },
      {
        path: 'jobs',
        loadComponent: () => import('./components/jobs/job-list.component').then(m => m.JobListComponent),
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
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
      }
    ]
  },
  { path: 'unauthorized', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
