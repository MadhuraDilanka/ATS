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
  duration: number;
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
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.css']
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
