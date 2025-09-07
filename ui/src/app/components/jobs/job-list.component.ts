import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService, Job } from '../../services/job.service';
import { UserRole, EmploymentType, JobStatus, ExperienceLevel } from '../../models/enums';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="job-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>work</mat-icon>
            Job Positions
          </mat-card-title>
          <div class="spacer"></div>
          <button 
            mat-raised-button 
            color="primary"
            *ngIf="canCreateJob()"
            (click)="createJob()">
            <mat-icon>add</mat-icon>
            Create Job
          </button>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="jobs" class="jobs-table">
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Job Title</th>
                <td mat-cell *matCellDef="let job">
                  <div class="job-title">
                    <strong>{{ job.title }}</strong>
                    <div class="job-department">{{ job.department }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Location Column -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Location</th>
                <td mat-cell *matCellDef="let job">
                  <mat-icon>location_on</mat-icon>
                  {{ job.location }}
                </td>
              </ng-container>

              <!-- Employment Type Column -->
              <ng-container matColumnDef="employmentType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let job">
                  <mat-chip [color]="getEmploymentTypeColor(job.employmentType)">
                    {{ job.employmentType }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let job">
                  <mat-chip [color]="getStatusColor(job.status)">
                    {{ job.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Applications Column -->
              <ng-container matColumnDef="applications">
                <th mat-header-cell *matHeaderCellDef>Applications</th>
                <td mat-cell *matCellDef="let job">
                  <div class="applications-count">
                    <mat-icon>people</mat-icon>
                    {{ job.applicationCount }}
                  </div>
                </td>
              </ng-container>

              <!-- Closing Date Column -->
              <ng-container matColumnDef="closingDate">
                <th mat-header-cell *matHeaderCellDef>Closing Date</th>
                <td mat-cell *matCellDef="let job">
                  {{ job.closingDate | date:'MMM dd, yyyy' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let job">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewJob(job)">
                      <mat-icon>visibility</mat-icon>
                      View Details
                    </button>
                    <button mat-menu-item (click)="viewApplications(job)" *ngIf="canViewApplications()">
                      <mat-icon>assignment</mat-icon>
                      View Applications ({{ job.applicationCount }})
                    </button>
                    <button mat-menu-item (click)="editJob(job)" *ngIf="canEditJob()">
                      <mat-icon>edit</mat-icon>
                      Edit Job
                    </button>
                    <button mat-menu-item (click)="deleteJob(job)" *ngIf="canDeleteJob()">
                      <mat-icon>delete</mat-icon>
                      Delete Job
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  (click)="viewJob(row)" 
                  class="job-row"></tr>
            </table>
          </div>

          <div class="no-data" *ngIf="jobs.length === 0">
            <mat-icon>work_off</mat-icon>
            <h3>No Jobs Available</h3>
            <p>There are currently no job positions available.</p>
            <button mat-raised-button color="primary" (click)="createJob()" *ngIf="canCreateJob()">
              Create First Job
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .job-list-container {
      padding: 20px;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spacer {
      flex: 1;
    }

    .table-container {
      overflow-x: auto;
    }

    .jobs-table {
      width: 100%;
    }

    .job-title strong {
      font-size: 16px;
      color: #1976d2;
    }

    .job-department {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .applications-count {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .job-row {
      cursor: pointer;
    }

    .job-row:hover {
      background-color: #f5f5f5;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    mat-chip {
      font-size: 12px;
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = false;
  displayedColumns: string[] = ['title', 'location', 'employmentType', 'status', 'applications', 'closingDate', 'actions'];

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.isLoading = false;
        // Fall back to mock data on error
        this.jobs = this.getMockJobs();
      }
    });
  }

  private getMockJobs(): Job[] {
    return [
      {
        id: 1,
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        employmentType: EmploymentType.FullTime,
        experienceLevel: ExperienceLevel.Senior,
        salaryMin: 120000,
        salaryMax: 160000,
        status: JobStatus.Active,
        closingDate: new Date('2024-02-15'),
        maxApplications: 50,
        isRemoteAllowed: true,
        hiringManagerId: 1,
        hiringManagerName: 'John Doe',
        applicationCount: 25,
        description: 'We are looking for a senior software engineer...',
        requirements: 'Bachelor\'s degree in Computer Science...',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY',
        employmentType: EmploymentType.FullTime,
        experienceLevel: ExperienceLevel.Mid,
        salaryMin: 110000,
        salaryMax: 140000,
        status: JobStatus.Active,
        closingDate: new Date('2024-02-10'),
        maxApplications: 30,
        isRemoteAllowed: false,
        hiringManagerId: 2,
        hiringManagerName: 'Jane Smith',
        applicationCount: 18,
        description: 'Seeking an experienced product manager...',
        requirements: 'MBA or equivalent experience...',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 3,
        title: 'UX Designer',
        department: 'Design',
        location: 'Remote',
        employmentType: EmploymentType.Contract,
        experienceLevel: ExperienceLevel.Junior,
        salaryMin: 80000,
        salaryMax: 100000,
        status: JobStatus.Draft,
        closingDate: new Date('2024-02-20'),
        maxApplications: 20,
        isRemoteAllowed: true,
        hiringManagerId: 3,
        hiringManagerName: 'Mike Johnson',
        applicationCount: 0,
        description: 'We need a creative UX designer...',
        requirements: 'Portfolio showcasing UX design skills...',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }

  canCreateJob(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canEditJob(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canDeleteJob(): boolean {
    return this.authService.isHR();
  }

  canViewApplications(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  createJob(): void {
    this.router.navigate(['/jobs/create']);
  }

  viewJob(job: Job): void {
    this.router.navigate(['/jobs', job.id]);
  }

  editJob(job: Job): void {
    this.router.navigate(['/jobs', job.id, 'edit']);
  }

  deleteJob(job: Job): void {
    if (confirm(`Are you sure you want to delete the job "${job.title}"?`)) {
      console.log('Deleting job:', job);
    }
  }

  viewApplications(job: Job): void {
    this.router.navigate(['/jobs', job.id, 'applications']);
  }

  getEmploymentTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'primary';
      case 'part-time':
        return 'accent';
      case 'contract':
        return 'warn';
      case 'internship':
        return '';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'primary';
      case 'draft':
        return 'accent';
      case 'closed':
        return 'warn';
      case 'archived':
        return '';
      default:
        return '';
    }
  }
}
