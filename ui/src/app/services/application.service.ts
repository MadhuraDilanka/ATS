import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApplicationStatus } from '../models/enums';

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  status: ApplicationStatus;
  coverLetter?: string;
  notes?: string;
  appliedDate: Date;
  rating?: number;
  reviewerNotes?: string;
  reviewerId?: number;
  reviewerName?: string;
  createdAt: Date;
  updatedAt: Date;
  interviewCount: number;
}

export interface CreateApplication {
  jobId: number;
  candidateId: number;
  coverLetter?: string;
  notes?: string;
}

export interface UpdateApplication {
  status: ApplicationStatus;
  notes?: string;
  rating?: number;
  reviewerNotes?: string;
  reviewerId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/api/applications`;

  constructor(private http: HttpClient) { }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/${id}`);
  }

  getApplicationsByJob(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/job/${jobId}`);
  }

  getApplicationsByCandidate(candidateId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/candidate/${candidateId}`);
  }

  createApplication(application: CreateApplication): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateApplication(id: number, application: UpdateApplication): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, application);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
