import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface DashboardData {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisMonth: number;
  interviewsThisWeek: number;
  hiredThisMonth: number;
  conversionRate: number;
  jobStatusBreakdown: JobStatusSummary[];
  applicationStatusBreakdown: ApplicationStatusSummary[];
  monthlyHiring: MonthlyHiringSummary[];
  departmentBreakdown: DepartmentSummary[];
}

export interface JobStatusSummary {
  status: string;
  count: number;
}

export interface ApplicationStatusSummary {
  status: string;
  count: number;
}

export interface MonthlyHiringSummary {
  month: string;
  hiredCount: number;
  applicationCount: number;
}

export interface DepartmentSummary {
  department: string;
  jobCount: number;
  applicationCount: number;
}

export interface QuickStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisMonth: number;
  interviewsThisWeek: number;
  hiredThisMonth: number;
}

export interface RecentActivity {
  type: string;
  description: string;
  date: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }

  getQuickStats(): Observable<QuickStats> {
    return this.http.get<QuickStats>(`${this.apiUrl}/quick-stats`);
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/recent-activities`);
  }
}
