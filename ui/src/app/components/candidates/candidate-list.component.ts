import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  currentJobTitle: string;
  experience: number;
  skills: string[];
  resumeUrl?: string;
  totalApplications: number;
  lastApplicationDate?: Date;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-candidate-list',
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
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="candidate-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>people</mat-icon>
            Candidates
          </mat-card-title>
          <div class="spacer"></div>
          <div class="search-section">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Search candidates</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm"
                (input)="onSearch()"
                placeholder="Search by name, skills, or location">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="filteredCandidates" class="candidates-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Candidate</th>
                <td mat-cell *matCellDef="let candidate">
                  <div class="candidate-info">
                    <div class="candidate-name">
                      <strong>{{ candidate.firstName }} {{ candidate.lastName }}</strong>
                    </div>
                    <div class="candidate-email">{{ candidate.email }}</div>
                    <div class="candidate-phone">{{ candidate.phone }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Current Position Column -->
              <ng-container matColumnDef="currentPosition">
                <th mat-header-cell *matHeaderCellDef>Current Position</th>
                <td mat-cell *matCellDef="let candidate">
                  <div class="position-info">
                    <div class="job-title">{{ candidate.currentJobTitle }}</div>
                    <div class="location">
                      <mat-icon>location_on</mat-icon>
                      {{ candidate.location }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Experience Column -->
              <ng-container matColumnDef="experience">
                <th mat-header-cell *matHeaderCellDef>Experience</th>
                <td mat-cell *matCellDef="let candidate">
                  <div class="experience-badge">
                    {{ candidate.experience }} {{ candidate.experience === 1 ? 'year' : 'years' }}
                  </div>
                </td>
              </ng-container>

              <!-- Skills Column -->
              <ng-container matColumnDef="skills">
                <th mat-header-cell *matHeaderCellDef>Key Skills</th>
                <td mat-cell *matCellDef="let candidate">
                  <div class="skills-container">
                    <mat-chip *ngFor="let skill of candidate.skills.slice(0, 3)" class="skill-chip">
                      {{ skill }}
                    </mat-chip>
                    <span *ngIf="candidate.skills.length > 3" class="more-skills">
                      +{{ candidate.skills.length - 3 }} more
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Applications Column -->
              <ng-container matColumnDef="applications">
                <th mat-header-cell *matHeaderCellDef>Applications</th>
                <td mat-cell *matCellDef="let candidate">
                  <div class="applications-info">
                    <div class="applications-count">
                      <mat-icon>assignment</mat-icon>
                      {{ candidate.totalApplications }}
                    </div>
                    <div class="last-application" *ngIf="candidate.lastApplicationDate">
                      Last: {{ candidate.lastApplicationDate | date:'MMM dd' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let candidate">
                  <mat-chip [color]="getStatusColor(candidate.status)">
                    {{ candidate.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let candidate">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="viewCandidate(candidate)">
                      <mat-icon>visibility</mat-icon>
                      View Profile
                    </button>
                    <button mat-menu-item (click)="viewResume(candidate)" *ngIf="candidate.resumeUrl">
                      <mat-icon>description</mat-icon>
                      View Resume
                    </button>
                    <button mat-menu-item (click)="viewApplications(candidate)" *ngIf="canViewApplications()">
                      <mat-icon>assignment</mat-icon>
                      View Applications
                    </button>
                    <button mat-menu-item (click)="scheduleInterview(candidate)" *ngIf="canScheduleInterview()">
                      <mat-icon>schedule</mat-icon>
                      Schedule Interview
                    </button>
                    <button mat-menu-item (click)="sendMessage(candidate)" *ngIf="canSendMessage()">
                      <mat-icon>message</mat-icon>
                      Send Message
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  (click)="viewCandidate(row)" 
                  class="candidate-row"></tr>
            </table>
          </div>

          <div class="no-data" *ngIf="filteredCandidates.length === 0">
            <mat-icon>person_search</mat-icon>
            <h3>No Candidates Found</h3>
            <p *ngIf="searchTerm">No candidates match your search criteria.</p>
            <p *ngIf="!searchTerm">There are currently no candidates in the system.</p>
            <button mat-button (click)="clearSearch()" *ngIf="searchTerm">
              Clear Search
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .candidate-list-container {
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

    .search-section {
      min-width: 300px;
    }

    .table-container {
      overflow-x: auto;
    }

    .candidates-table {
      width: 100%;
    }

    .candidate-info {
      line-height: 1.4;
    }

    .candidate-name strong {
      font-size: 16px;
      color: #1976d2;
    }

    .candidate-email, .candidate-phone {
      font-size: 12px;
      color: #666;
    }

    .position-info .job-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .position-info .location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }

    .position-info .location mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .experience-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }

    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }

    .skill-chip {
      font-size: 11px;
      height: 24px;
    }

    .more-skills {
      font-size: 11px;
      color: #666;
      font-style: italic;
    }

    .applications-info {
      text-align: center;
    }

    .applications-count {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-bottom: 2px;
    }

    .last-application {
      font-size: 11px;
      color: #666;
    }

    .candidate-row {
      cursor: pointer;
    }

    .candidate-row:hover {
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
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['name', 'currentPosition', 'experience', 'skills', 'applications', 'status', 'actions'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    // Mock data - replace with actual API call
    this.candidates = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        currentJobTitle: 'Software Engineer',
        experience: 5,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
        resumeUrl: '/resumes/john-doe.pdf',
        totalApplications: 3,
        lastApplicationDate: new Date('2024-01-20'),
        status: 'Active',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        currentJobTitle: 'Product Manager',
        experience: 7,
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'SQL'],
        resumeUrl: '/resumes/jane-smith.pdf',
        totalApplications: 2,
        lastApplicationDate: new Date('2024-01-18'),
        status: 'Active',
        createdAt: new Date('2024-01-05')
      },
      {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        currentJobTitle: 'UX Designer',
        experience: 3,
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'HTML/CSS'],
        resumeUrl: '/resumes/michael-johnson.pdf',
        totalApplications: 1,
        lastApplicationDate: new Date('2024-01-15'),
        status: 'Active',
        createdAt: new Date('2024-01-10')
      }
    ];
    this.filteredCandidates = [...this.candidates];
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCandidates = [...this.candidates];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCandidates = this.candidates.filter(candidate =>
      candidate.firstName.toLowerCase().includes(term) ||
      candidate.lastName.toLowerCase().includes(term) ||
      candidate.email.toLowerCase().includes(term) ||
      candidate.currentJobTitle.toLowerCase().includes(term) ||
      candidate.location.toLowerCase().includes(term) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(term))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  canViewApplications(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canScheduleInterview(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  canSendMessage(): boolean {
    return this.authService.isHR() || this.authService.isManager();
  }

  viewCandidate(candidate: Candidate): void {
    this.router.navigate(['/candidates', candidate.id]);
  }

  viewResume(candidate: Candidate): void {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank');
    }
  }

  viewApplications(candidate: Candidate): void {
    this.router.navigate(['/candidates', candidate.id, 'applications']);
  }

  scheduleInterview(candidate: Candidate): void {
    this.router.navigate(['/interviews/schedule'], { 
      queryParams: { candidateId: candidate.id }
    });
  }

  sendMessage(candidate: Candidate): void {
    // Implement messaging functionality
    console.log('Sending message to:', candidate);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'primary';
      case 'hired':
        return 'primary';
      case 'rejected':
        return 'warn';
      case 'on-hold':
        return 'accent';
      case 'withdrawn':
        return '';
      default:
        return '';
    }
  }
}
