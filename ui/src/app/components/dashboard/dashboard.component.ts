import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService, DashboardData, QuickStats, RecentActivity } from '../../services/dashboard.service';
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  UserRole = UserRole;
  isLoading = false;

  dashboardData: DashboardData = {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplicationsThisMonth: 0,
    interviewsThisWeek: 0,
    hiredThisMonth: 0,
    conversionRate: 0,
    jobStatusBreakdown: [],
    applicationStatusBreakdown: [],
    monthlyHiring: [],
    departmentBreakdown: []
  };

  recentActivities: RecentActivity[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
        this.loadMockData();
      }
    });

    this.dashboardService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
      }
    });
  }

  private loadMockData(): void {
    this.dashboardData = {
      totalJobs: 25,
      activeJobs: 12,
      totalApplications: 234,
      newApplicationsThisMonth: 45,
      interviewsThisWeek: 8,
      hiredThisMonth: 3,
      conversionRate: 12.5,
      jobStatusBreakdown: [
        { status: 'Active', count: 12 },
        { status: 'Closed', count: 8 },
        { status: 'Draft', count: 5 }
      ],
      applicationStatusBreakdown: [
        { status: 'Applied', count: 150 },
        { status: 'InReview', count: 45 },
        { status: 'Interview', count: 25 },
        { status: 'Hired', count: 14 }
      ],
      monthlyHiring: [],
      departmentBreakdown: []
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
