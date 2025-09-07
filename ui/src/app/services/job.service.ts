import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ExperienceLevel, EmploymentType, JobStatus } from '../models/enums';

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  department: string;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  closingDate?: Date;
  maxApplications: number;
  isRemoteAllowed: boolean;
  hiringManagerId: number;
  hiringManagerName: string;
  createdAt: Date;
  updatedAt: Date;
  applicationCount: number;
}

export interface CreateJob {
  title: string;
  description: string;
  requirements: string;
  location: string;
  department: string;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  closingDate?: Date;
  maxApplications: number;
  isRemoteAllowed: boolean;
  hiringManagerId: number;
}

export interface UpdateJob {
  title: string;
  description: string;
  requirements: string;
  location: string;
  department: string;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  closingDate?: Date;
  maxApplications: number;
  isRemoteAllowed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly apiUrl = `${environment.apiUrl}/api/jobs`;

  constructor(private http: HttpClient) { }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  createJob(job: CreateJob): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  updateJob(id: number, job: UpdateJob): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
