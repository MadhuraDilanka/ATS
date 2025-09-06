import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/enums';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  UserRole = UserRole;

  // Dashboard KPIs
  dashboardData = {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplicationsThisMonth: 0,
    interviewsThisWeek: 0,
    hiredThisMonth: 0,
    conversionRate: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // TODO: Implement API calls to get dashboard data
    // For now, using mock data
    this.dashboardData = {
      totalJobs: 25,
      activeJobs: 12,
      totalApplications: 234,
      newApplicationsThisMonth: 45,
      interviewsThisWeek: 8,
      hiredThisMonth: 3,
      conversionRate: 12.5
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToJobs(): void {
    this.router.navigate(['/jobs']);
  }

  navigateToCandidates(): void {
    this.router.navigate(['/candidates']);
  }

  navigateToApplications(): void {
    this.router.navigate(['/applications']);
  }

  navigateToInterviews(): void {
    this.router.navigate(['/interviews']);
  }
}
