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
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
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
