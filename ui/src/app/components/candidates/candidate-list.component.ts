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
import { CandidateService, Candidate } from '../../services/candidate.service';

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
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  isLoading = false;
  searchTerm: string = '';
  displayedColumns: string[] = ['name', 'currentPosition', 'experience', 'skills', 'applications', 'status', 'actions'];

  constructor(
    private authService: AuthService,
    private candidateService: CandidateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    this.candidateService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates = candidates;
        this.filteredCandidates = candidates;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.isLoading = false;
        // Fall back to mock data on error
        this.candidates = this.getMockCandidates();
        this.filteredCandidates = this.candidates;
      }
    });
  }

  private getMockCandidates(): Candidate[] {
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phoneNumber: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        currentJobTitle: 'Software Engineer',
        currentCompany: 'Tech Corp',
        yearsOfExperience: 5,
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
        applicationCount: 3,
        isAvailable: true,
        expectedSalary: 150000,
        summary: 'Experienced software engineer with full-stack development skills',
        linkedInProfile: 'linkedin.com/in/johndoe',
        gitHubProfile: 'github.com/johndoe',
        portfolio: 'johndoe.dev',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phoneNumber: '+1 (555) 987-6543',
        address: 'New York, NY',
        currentJobTitle: 'Product Manager',
        currentCompany: 'Product Inc',
        yearsOfExperience: 7,
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'SQL'],
        applicationCount: 2,
        isAvailable: true,
        expectedSalary: 140000,
        summary: 'Strategic product manager with data-driven approach',
        linkedInProfile: 'linkedin.com/in/janesmith',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@email.com',
        phoneNumber: '+1 (555) 456-7890',
        address: 'Austin, TX',
        currentJobTitle: 'UX Designer',
        currentCompany: 'Design Studio',
        yearsOfExperience: 3,
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'HTML/CSS'],
        applicationCount: 1,
        isAvailable: true,
        expectedSalary: 110000,
        summary: 'Creative UX designer focused on user-centered design',
        portfolio: 'michaeljohnson.design',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      }
    ];
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
      (candidate.currentJobTitle && candidate.currentJobTitle.toLowerCase().includes(term)) ||
      (candidate.address && candidate.address.toLowerCase().includes(term)) ||
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
    if (candidate.portfolio) {
      window.open(candidate.portfolio, '_blank');
    } else {
      console.log('No portfolio available for', candidate.firstName, candidate.lastName);
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
