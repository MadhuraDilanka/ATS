import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApplicationService, Application } from '../../services/application.service';
import { ApplicationStatus } from '../../models/enums';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = false;
  selectedStatus: string = '';
  selectedStage: string = '';
  displayedColumns: string[] = ['candidate', 'job', 'status', 'score', 'interviews', 'actions'];

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filteredApplications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
        // Fall back to mock data on error
        this.applications = this.getMockApplications();
        this.filteredApplications = this.applications;
      }
    });
  }

  private getMockApplications(): Application[] {
    return [
      {
        id: 1,
        candidateId: 1,
        candidateName: 'John Doe',
        candidateEmail: 'john.doe@email.com',
        jobId: 1,
        jobTitle: 'Senior Software Engineer',
        appliedDate: new Date('2024-01-20'),
        status: ApplicationStatus.ScreeningInProgress,
        rating: 85,
        interviewCount: 2,
        notes: 'Strong technical background',
        reviewerNotes: 'Excellent candidate for technical role',
        reviewerId: 1,
        reviewerName: 'HR Manager',
        coverLetter: 'I am excited to apply for this position...',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: 2,
        candidateId: 2,
        candidateName: 'Jane Smith',
        candidateEmail: 'jane.smith@email.com',
        jobId: 2,
        jobTitle: 'Product Manager',
        appliedDate: new Date('2024-01-18'),
        status: ApplicationStatus.InterviewScheduled,
        rating: 92,
        interviewCount: 3,
        notes: 'Excellent product management experience',
        reviewerNotes: 'Top candidate for PM role',
        reviewerId: 2,
        reviewerName: 'VP Product',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-28')
      },
      {
        id: 3,
        candidateId: 3,
        candidateName: 'Michael Johnson',
        candidateEmail: 'michael.johnson@email.com',
        jobId: 3,
        jobTitle: 'UX Designer',
        appliedDate: new Date('2024-01-15'),
        status: ApplicationStatus.Applied,
        interviewCount: 0,
        coverLetter: 'My design philosophy centers on user-centered design...',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ];
  }

  onFilterChange(): void {
    this.filteredApplications = this.applications.filter(application => {
      const statusMatch = !this.selectedStatus || application.status.toString() === this.selectedStatus;
      return statusMatch;
    });
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedStage = '';
    this.onFilterChange();
  }

  canScheduleInterview(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canUpdateStatus(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canAddNotes(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canSendMessage(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  viewApplication(application: Application): void {
    this.router.navigate(['/applications', application.id]);
  }

  viewResume(application: Application): void {
    // Since the Application interface doesn't have resumeUrl, 
    // we could navigate to candidate detail or show a message
    this.router.navigate(['/candidates', application.candidateId]);
  }

  viewCoverLetter(application: Application): void {
    if (application.coverLetter) {
      // Display cover letter in a dialog or navigate to detailed view
      console.log('Cover Letter:', application.coverLetter);
    } else {
      console.log('No cover letter available');
    }
  }

  scheduleInterview(application: Application): void {
    this.router.navigate(['/interviews/schedule'], {
      queryParams: { 
        applicationId: application.id,
        candidateId: application.candidateId
      }
    });
  }

  updateStatus(application: Application): void {
    console.log('Updating status for:', application);
  }

  addNotes(application: Application): void {
    console.log('Adding notes for:', application);
  }

  sendMessage(application: Application): void {
    console.log('Sending message for:', application);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'applied':
        return '';
      case 'under review':
        return 'accent';
      case 'interview scheduled':
        return 'primary';
      case 'interviewed':
        return 'primary';
      case 'offered':
        return 'primary';
      case 'hired':
        return 'primary';
      case 'rejected':
        return 'warn';
      case 'withdrawn':
        return '';
      default:
        return '';
    }
  }

  getStageColor(stage: string): string {
    switch (stage.toLowerCase()) {
      case 'application review':
        return '';
      case 'phone screening':
        return 'accent';
      case 'technical interview':
        return 'primary';
      case 'on-site interview':
        return 'primary';
      case 'final interview':
        return 'primary';
      case 'reference check':
        return 'accent';
      case 'decision':
        return 'warn';
      default:
        return '';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'high-score';
    if (score >= 60) return 'medium-score';
    return 'low-score';
  }
}
