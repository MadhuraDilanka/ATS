import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  linkedInProfile?: string;
  gitHubProfile?: string;
  portfolio?: string;
  summary?: string;
  yearsOfExperience?: number;
  currentJobTitle?: string;
  currentCompany?: string;
  expectedSalary?: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  applicationCount: number;
  skills: string[];
}

export interface CreateCandidate {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  linkedInProfile?: string;
  gitHubProfile?: string;
  portfolio?: string;
  summary?: string;
  yearsOfExperience?: number;
  currentJobTitle?: string;
  currentCompany?: string;
  expectedSalary?: number;
  isAvailable?: boolean;
}

export interface UpdateCandidate {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  linkedInProfile?: string;
  gitHubProfile?: string;
  portfolio?: string;
  summary?: string;
  yearsOfExperience?: number;
  currentJobTitle?: string;
  currentCompany?: string;
  expectedSalary?: number;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly apiUrl = `${environment.apiUrl}/api/candidates`;

  constructor(private http: HttpClient) { }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl);
  }

  getCandidate(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  createCandidate(candidate: CreateCandidate): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, candidate);
  }

  updateCandidate(id: number, candidate: UpdateCandidate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, candidate);
  }

  deleteCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
