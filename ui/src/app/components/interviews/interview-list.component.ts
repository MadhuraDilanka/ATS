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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Interview {
  id: number;
  applicationId: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
  interviewType: string;
  scheduledDate: Date;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  interviewerIds: number[];
  interviewerNames: string[];
  status: string;
  stage: string;
  notes?: string;
  score?: number;
  feedback?: string;
  isCompleted: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-interview-list',
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  template: `
    <div class="interview-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>schedule</mat-icon>
            Interviews
          </mat-card-title>
          <div class="spacer"></div>
          <div class="actions-section">
            <button 
              mat-raised-button 
              color="primary"
              *ngIf="canScheduleInterview()"
              (click)="scheduleInterview()">
              <mat-icon>add</mat-icon>
              Schedule Interview
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="filters-section">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Filter by Status</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="onFilterChange()">
                <mat-option value="">All Statuses</mat-option>
                <mat-option value="Scheduled">Scheduled</mat-option>
                <mat-option value="Confirmed">Confirmed</mat-option>
                <mat-option value="In Progress">In Progress</mat-option>
                <mat-option value="Completed">Completed</mat-option>
                <mat-option value="Cancelled">Cancelled</mat-option>
                <mat-option value="Rescheduled">Rescheduled</mat-option>
                <mat-option value="No Show">No Show</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Filter by Type</mat-label>
              <mat-select [(value)]="selectedType" (selectionChange)="onFilterChange()">
                <mat-option value="">All Types</mat-option>
                <mat-option value="Phone Screening">Phone Screening</mat-option>
                <mat-option value="Video Call">Video Call</mat-option>
                <mat-option value="On-site">On-site</mat-option>
                <mat-option value="Technical">Technical</mat-option>
                <mat-option value="Behavioral">Behavioral</mat-option>
                <mat-option value="Final">Final</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Date Range</mat-label>
              <mat-date-range-input [rangePicker]="picker">
                <input matStartDate [(ngModel)]="startDate" (dateChange)="onFilterChange()" placeholder="Start date">
                <input matEndDate [(ngModel)]="endDate" (dateChange)="onFilterChange()" placeholder="End date">
              </mat-date-range-input>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-date-range-picker #picker></mat-date-range-picker>
            </mat-form-field>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="filteredInterviews" class="interviews-table">
              <!-- Candidate Column -->
              <ng-container matColumnDef="candidate">
                <th mat-header-cell *matHeaderCellDef>Candidate</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="candidate-info">
                    <div class="candidate-name">
                      <strong>{{ interview.candidateName }}</strong>
                    </div>
                    <div class="candidate-email">{{ interview.candidateEmail }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Job Column -->
              <ng-container matColumnDef="job">
                <th mat-header-cell *matHeaderCellDef>Position</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="job-title">{{ interview.jobTitle }}</div>
                </td>
              </ng-container>

              <!-- Interview Details Column -->
              <ng-container matColumnDef="details">
                <th mat-header-cell *matHeaderCellDef>Interview Details</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="interview-details">
                    <div class="interview-type">
                      <mat-chip [color]="getTypeColor(interview.interviewType)">
                        {{ interview.interviewType }}
                      </mat-chip>
                    </div>
                    <div class="interview-stage">{{ interview.stage }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Date & Time Column -->
              <ng-container matColumnDef="datetime">
                <th mat-header-cell *matHeaderCellDef>Date & Time</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="datetime-info">
                    <div class="date">
                      <mat-icon>calendar_today</mat-icon>
                      {{ interview.scheduledDate | date:'MMM dd, yyyy' }}
                    </div>
                    <div class="time">
                      <mat-icon>access_time</mat-icon>
                      {{ interview.scheduledDate | date:'HH:mm' }} 
                      ({{ interview.duration }}min)
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Location Column -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Location</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="location-info">
                    <div *ngIf="interview.location" class="location">
                      <mat-icon>location_on</mat-icon>
                      {{ interview.location }}
                    </div>
                    <div *ngIf="interview.meetingLink" class="meeting-link">
                      <mat-icon>videocam</mat-icon>
                      <a [href]="interview.meetingLink" target="_blank">Join Meeting</a>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Interviewers Column -->
              <ng-container matColumnDef="interviewers">
                <th mat-header-cell *matHeaderCellDef>Interviewers</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="interviewers-list">
                    <div *ngFor="let interviewer of interview.interviewerNames.slice(0, 2)" 
                         class="interviewer-name">
                      {{ interviewer }}
                    </div>
                    <div *ngIf="interview.interviewerNames.length > 2" class="more-interviewers">
                      +{{ interview.interviewerNames.length - 2 }} more
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let interview">
                  <mat-chip [color]="getStatusColor(interview.status)">
                    {{ interview.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Score Column -->
              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Score</th>
                <td mat-cell *matCellDef="let interview">
                  <div class="score-container" *ngIf="interview.score && interview.isCompleted">
                    <div class="score-badge" [ngClass]="getScoreClass(interview.score)">
                      {{ interview.score }}/100
                    </div>
                  </div>
                  <span *ngIf="!interview.score || !interview.isCompleted" class="no-score">
                    {{ !interview.isCompleted ? 'Pending' : 'Not scored' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let interview">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewInterview(interview)">
                      <mat-icon>visibility</mat-icon>
                      View Details
                    </button>
                    <button mat-menu-item (click)="editInterview(interview)" 
                            *ngIf="canEditInterview() && !interview.isCompleted">
                      <mat-icon>edit</mat-icon>
                      Edit Interview
                    </button>
                    <button mat-menu-item (click)="joinMeeting(interview)" 
                            *ngIf="interview.meetingLink && isToday(interview.scheduledDate)">
                      <mat-icon>videocam</mat-icon>
                      Join Meeting
                    </button>
                    <button mat-menu-item (click)="addFeedback(interview)" 
                            *ngIf="canAddFeedback() && interview.isCompleted">
                      <mat-icon>rate_review</mat-icon>
                      Add Feedback
                    </button>
                    <button mat-menu-item (click)="rescheduleInterview(interview)" 
                            *ngIf="canReschedule() && !interview.isCompleted">
                      <mat-icon>schedule</mat-icon>
                      Reschedule
                    </button>
                    <button mat-menu-item (click)="cancelInterview(interview)" 
                            *ngIf="canCancel() && !interview.isCompleted">
                      <mat-icon>cancel</mat-icon>
                      Cancel
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  (click)="viewInterview(row)" 
                  class="interview-row"
                  [ngClass]="getRowClass(row)"></tr>
            </table>
          </div>

          <div class="no-data" *ngIf="filteredInterviews.length === 0">
            <mat-icon>schedule</mat-icon>
            <h3>No Interviews Found</h3>
            <p *ngIf="selectedStatus || selectedType || startDate || endDate">
              No interviews match your filter criteria.
            </p>
            <p *ngIf="!selectedStatus && !selectedType && !startDate && !endDate">
              There are currently no interviews scheduled.
            </p>
            <button mat-button (click)="clearFilters()" 
                    *ngIf="selectedStatus || selectedType || startDate || endDate">
              Clear Filters
            </button>
            <button mat-raised-button color="primary" (click)="scheduleInterview()" 
                    *ngIf="canScheduleInterview() && !selectedStatus && !selectedType">
              Schedule First Interview
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .interview-list-container {
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
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filters-section mat-form-field {
      min-width: 200px;
    }

    .table-container {
      overflow-x: auto;
    }

    .interviews-table {
      width: 100%;
    }

    .candidate-info {
      line-height: 1.4;
    }

    .candidate-name strong {
      font-size: 16px;
      color: #1976d2;
    }

    .candidate-email {
      font-size: 12px;
      color: #666;
    }

    .job-title {
      font-weight: 500;
    }

    .interview-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .interview-stage {
      font-size: 12px;
      color: #666;
    }

    .datetime-info {
      line-height: 1.4;
    }

    .datetime-info .date,
    .datetime-info .time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }

    .datetime-info mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .location-info {
      line-height: 1.4;
    }

    .location-info .location,
    .location-info .meeting-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }

    .location-info mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .meeting-link a {
      color: #1976d2;
      text-decoration: none;
    }

    .meeting-link a:hover {
      text-decoration: underline;
    }

    .interviewers-list {
      line-height: 1.3;
    }

    .interviewer-name {
      font-size: 12px;
    }

    .more-interviewers {
      font-size: 11px;
      color: #666;
      font-style: italic;
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

    .interview-row {
      cursor: pointer;
    }

    .interview-row:hover {
      background-color: #f5f5f5;
    }

    .interview-row.today {
      background-color: #e8f5e8;
    }

    .interview-row.overdue {
      background-color: #ffebee;
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
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];
  filteredInterviews: Interview[] = [];
  selectedStatus: string = '';
  selectedType: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  displayedColumns: string[] = ['candidate', 'job', 'details', 'datetime', 'location', 'interviewers', 'status', 'score', 'actions'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    // Mock data - replace with actual API call
    this.interviews = [
      {
        id: 1,
        applicationId: 1,
        candidateId: 1,
        candidateName: 'John Doe',
        candidateEmail: 'john.doe@email.com',
        jobId: 1,
        jobTitle: 'Senior Software Engineer',
        interviewType: 'Technical',
        scheduledDate: new Date('2024-02-01T10:00:00'),
        duration: 60,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        interviewerIds: [1, 2],
        interviewerNames: ['Alice Johnson', 'Bob Smith'],
        status: 'Scheduled',
        stage: 'Technical Interview',
        isCompleted: false,
        createdAt: new Date('2024-01-25')
      },
      {
        id: 2,
        applicationId: 2,
        candidateId: 2,
        candidateName: 'Jane Smith',
        candidateEmail: 'jane.smith@email.com',
        jobId: 2,
        jobTitle: 'Product Manager',
        interviewType: 'Final',
        scheduledDate: new Date('2024-01-30T14:30:00'),
        duration: 45,
        location: 'Conference Room A',
        interviewerIds: [3, 4, 5],
        interviewerNames: ['Carol Davis', 'David Wilson', 'Eve Brown'],
        status: 'Completed',
        stage: 'Final Interview',
        score: 88,
        feedback: 'Excellent candidate with strong leadership skills',
        isCompleted: true,
        createdAt: new Date('2024-01-20')
      },
      {
        id: 3,
        applicationId: 3,
        candidateId: 3,
        candidateName: 'Michael Johnson',
        candidateEmail: 'michael.johnson@email.com',
        jobId: 3,
        jobTitle: 'UX Designer',
        interviewType: 'Phone Screening',
        scheduledDate: new Date('2024-02-02T11:00:00'),
        duration: 30,
        interviewerIds: [6],
        interviewerNames: ['Frank Miller'],
        status: 'Confirmed',
        stage: 'Phone Screening',
        isCompleted: false,
        createdAt: new Date('2024-01-28')
      }
    ];
    this.filteredInterviews = [...this.interviews];
  }

  onFilterChange(): void {
    this.filteredInterviews = this.interviews.filter(interview => {
      const statusMatch = !this.selectedStatus || interview.status === this.selectedStatus;
      const typeMatch = !this.selectedType || interview.interviewType === this.selectedType;
      
      let dateMatch = true;
      if (this.startDate && this.endDate) {
        const interviewDate = new Date(interview.scheduledDate);
        dateMatch = interviewDate >= this.startDate && interviewDate <= this.endDate;
      }
      
      return statusMatch && typeMatch && dateMatch;
    });
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedType = '';
    this.startDate = null;
    this.endDate = null;
    this.onFilterChange();
  }

  canScheduleInterview(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canEditInterview(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canAddFeedback(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canReschedule(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canCancel(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  scheduleInterview(): void {
    this.router.navigate(['/interviews/schedule']);
  }

  viewInterview(interview: Interview): void {
    this.router.navigate(['/interviews', interview.id]);
  }

  editInterview(interview: Interview): void {
    this.router.navigate(['/interviews', interview.id, 'edit']);
  }

  joinMeeting(interview: Interview): void {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
    }
  }

  addFeedback(interview: Interview): void {
    this.router.navigate(['/interviews', interview.id, 'feedback']);
  }

  rescheduleInterview(interview: Interview): void {
    this.router.navigate(['/interviews', interview.id, 'reschedule']);
  }

  cancelInterview(interview: Interview): void {
    if (confirm(`Are you sure you want to cancel the interview with ${interview.candidateName}?`)) {
      // Implement cancel logic here
      console.log('Cancelling interview:', interview);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    const interviewDate = new Date(date);
    return today.toDateString() === interviewDate.toDateString();
  }

  getRowClass(interview: Interview): string {
    if (this.isToday(interview.scheduledDate)) {
      return 'today';
    }
    if (new Date(interview.scheduledDate) < new Date() && !interview.isCompleted) {
      return 'overdue';
    }
    return '';
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'accent';
      case 'confirmed':
        return 'primary';
      case 'in progress':
        return 'primary';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'warn';
      case 'rescheduled':
        return 'accent';
      case 'no show':
        return 'warn';
      default:
        return '';
    }
  }

  getTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'phone screening':
        return '';
      case 'video call':
        return 'accent';
      case 'on-site':
        return 'primary';
      case 'technical':
        return 'primary';
      case 'behavioral':
        return 'accent';
      case 'final':
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
