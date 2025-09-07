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

interface Application {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
  department: string;
  applicationDate: Date;
  status: string;
  stage: string;
  notes?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  score?: number;
  interviewCount: number;
  lastInterviewDate?: Date;
}

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
  template: `
    <div class="application-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>assignment</mat-icon>
            Applications
          </mat-card-title>
          <div class="spacer"></div>
          <div class="filters-section">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Filter by Status</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="onFilterChange()">
                <mat-option value="">All Statuses</mat-option>
                <mat-option value="Applied">Applied</mat-option>
                <mat-option value="Under Review">Under Review</mat-option>
                <mat-option value="Interview Scheduled">Interview Scheduled</mat-option>
                <mat-option value="Interviewed">Interviewed</mat-option>
                <mat-option value="Offered">Offered</mat-option>
                <mat-option value="Hired">Hired</mat-option>
                <mat-option value="Rejected">Rejected</mat-option>
                <mat-option value="Withdrawn">Withdrawn</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Filter by Stage</mat-label>
              <mat-select [(value)]="selectedStage" (selectionChange)="onFilterChange()">
                <mat-option value="">All Stages</mat-option>
                <mat-option value="Application Review">Application Review</mat-option>
                <mat-option value="Phone Screening">Phone Screening</mat-option>
                <mat-option value="Technical Interview">Technical Interview</mat-option>
                <mat-option value="On-site Interview">On-site Interview</mat-option>
                <mat-option value="Final Interview">Final Interview</mat-option>
                <mat-option value="Reference Check">Reference Check</mat-option>
                <mat-option value="Decision">Decision</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="filteredApplications" class="applications-table">
              <!-- Candidate Column -->
              <ng-container matColumnDef="candidate">
                <th mat-header-cell *matHeaderCellDef>Candidate</th>
                <td mat-cell *matCellDef="let application">
                  <div class="candidate-info">
                    <div class="candidate-name">
                      <strong>{{ application.candidateName }}</strong>
                    </div>
                    <div class="candidate-email">{{ application.candidateEmail }}</div>
                    <div class="application-date">
                      Applied: {{ application.applicationDate | date:'MMM dd, yyyy' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Job Column -->
              <ng-container matColumnDef="job">
                <th mat-header-cell *matHeaderCellDef>Position</th>
                <td mat-cell *matCellDef="let application">
                  <div class="job-info">
                    <div class="job-title">{{ application.jobTitle }}</div>
                    <div class="job-department">{{ application.department }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let application">
                  <mat-chip [color]="getStatusColor(application.status)">
                    {{ application.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Stage Column -->
              <ng-container matColumnDef="stage">
                <th mat-header-cell *matHeaderCellDef>Current Stage</th>
                <td mat-cell *matCellDef="let application">
                  <div class="stage-info">
                    <mat-chip [color]="getStageColor(application.stage)">
                      {{ application.stage }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Score Column -->
              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Score</th>
                <td mat-cell *matCellDef="let application">
                  <div class="score-container" *ngIf="application.score">
                    <div class="score-badge" [ngClass]="getScoreClass(application.score)">
                      {{ application.score }}/100
                    </div>
                  </div>
                  <span *ngIf="!application.score" class="no-score">Not scored</span>
                </td>
              </ng-container>

              <!-- Interviews Column -->
              <ng-container matColumnDef="interviews">
                <th mat-header-cell *matHeaderCellDef>Interviews</th>
                <td mat-cell *matCellDef="let application">
                  <div class="interview-info">
                    <div class="interview-count">
                      <mat-icon>schedule</mat-icon>
                      {{ application.interviewCount }}
                    </div>
                    <div class="last-interview" *ngIf="application.lastInterviewDate">
                      Last: {{ application.lastInterviewDate | date:'MMM dd' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let application">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewApplication(application)">
                      <mat-icon>visibility</mat-icon>
                      View Details
                    </button>
                    <button mat-menu-item (click)="viewResume(application)" *ngIf="application.resumeUrl">
                      <mat-icon>description</mat-icon>
                      View Resume
                    </button>
                    <button mat-menu-item (click)="viewCoverLetter(application)" *ngIf="application.coverLetterUrl">
                      <mat-icon>note</mat-icon>
                      View Cover Letter
                    </button>
                    <button mat-menu-item (click)="scheduleInterview(application)" *ngIf="canScheduleInterview()">
                      <mat-icon>schedule</mat-icon>
                      Schedule Interview
                    </button>
                    <button mat-menu-item (click)="updateStatus(application)" *ngIf="canUpdateStatus()">
                      <mat-icon>update</mat-icon>
                      Update Status
                    </button>
                    <button mat-menu-item (click)="addNotes(application)" *ngIf="canAddNotes()">
                      <mat-icon>note_add</mat-icon>
                      Add Notes
                    </button>
                    <button mat-menu-item (click)="sendMessage(application)" *ngIf="canSendMessage()">
                      <mat-icon>message</mat-icon>
                      Send Message
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  (click)="viewApplication(row)" 
                  class="application-row"></tr>
            </table>
          </div>

          <div class="no-data" *ngIf="filteredApplications.length === 0">
            <mat-icon>assignment_late</mat-icon>
            <h3>No Applications Found</h3>
            <p *ngIf="selectedStatus || selectedStage">No applications match your filter criteria.</p>
            <p *ngIf="!selectedStatus && !selectedStage">There are currently no applications in the system.</p>
            <button mat-button (click)="clearFilters()" *ngIf="selectedStatus || selectedStage">
              Clear Filters
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .application-list-container {
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

    .filters-section {
      display: flex;
      gap: 16px;
      min-width: 400px;
    }

    .filters-section mat-form-field {
      flex: 1;
    }

    .table-container {
      overflow-x: auto;
    }

    .applications-table {
      width: 100%;
    }

    .candidate-info {
      line-height: 1.4;
    }

    .candidate-name strong {
      font-size: 16px;
      color: #1976d2;
    }

    .candidate-email, .application-date {
      font-size: 12px;
      color: #666;
    }

    .job-info .job-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .job-info .job-department {
      font-size: 12px;
      color: #666;
    }

    .stage-info {
      text-align: center;
    }

    .score-container {
      text-align: center;
    }

    .score-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }

    .score-badge.high-score {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .score-badge.medium-score {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .score-badge.low-score {
      background-color: #ffcdd2;
      color: #d32f2f;
    }

    .no-score {
      font-size: 12px;
      color: #999;
      font-style: italic;
    }

    .interview-info {
      text-align: center;
    }

    .interview-count {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-bottom: 2px;
    }

    .last-interview {
      font-size: 11px;
      color: #666;
    }

    .application-row {
      cursor: pointer;
    }

    .application-row:hover {
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
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  selectedStatus: string = '';
  selectedStage: string = '';
  displayedColumns: string[] = ['candidate', 'job', 'status', 'stage', 'score', 'interviews', 'actions'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applications = [
      {
        id: 1,
        candidateId: 1,
        candidateName: 'John Doe',
        candidateEmail: 'john.doe@email.com',
        jobId: 1,
        jobTitle: 'Senior Software Engineer',
        department: 'Engineering',
        applicationDate: new Date('2024-01-20'),
        status: 'Under Review',
        stage: 'Technical Interview',
        score: 85,
        interviewCount: 2,
        lastInterviewDate: new Date('2024-01-25'),
        resumeUrl: '/resumes/john-doe.pdf',
        coverLetterUrl: '/cover-letters/john-doe.pdf'
      },
      {
        id: 2,
        candidateId: 2,
        candidateName: 'Jane Smith',
        candidateEmail: 'jane.smith@email.com',
        jobId: 2,
        jobTitle: 'Product Manager',
        department: 'Product',
        applicationDate: new Date('2024-01-18'),
        status: 'Interview Scheduled',
        stage: 'Final Interview',
        score: 92,
        interviewCount: 3,
        lastInterviewDate: new Date('2024-01-28'),
        resumeUrl: '/resumes/jane-smith.pdf'
      },
      {
        id: 3,
        candidateId: 3,
        candidateName: 'Michael Johnson',
        candidateEmail: 'michael.johnson@email.com',
        jobId: 3,
        jobTitle: 'UX Designer',
        department: 'Design',
        applicationDate: new Date('2024-01-15'),
        status: 'Applied',
        stage: 'Application Review',
        interviewCount: 0,
        resumeUrl: '/resumes/michael-johnson.pdf',
        coverLetterUrl: '/cover-letters/michael-johnson.pdf'
      }
    ];
    this.filteredApplications = [...this.applications];
  }

  onFilterChange(): void {
    this.filteredApplications = this.applications.filter(application => {
      const statusMatch = !this.selectedStatus || application.status === this.selectedStatus;
      const stageMatch = !this.selectedStage || application.stage === this.selectedStage;
      return statusMatch && stageMatch;
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
    if (application.resumeUrl) {
      window.open(application.resumeUrl, '_blank');
    }
  }

  viewCoverLetter(application: Application): void {
    if (application.coverLetterUrl) {
      window.open(application.coverLetterUrl, '_blank');
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
