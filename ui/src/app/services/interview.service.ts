import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { InterviewType, InterviewStatus } from '../models/enums';

export interface Interview {
  id: number;
  applicationId: number;
  interviewerId: number;
  interviewerName: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledDateTime: Date;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  recommendation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInterview {
  applicationId: number;
  interviewerId: number;
  type: InterviewType;
  scheduledDateTime: Date;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

export interface UpdateInterview {
  status: InterviewStatus;
  scheduledDateTime: Date;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  recommendation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private readonly apiUrl = `${environment.apiUrl}/api/interviews`;

  constructor(private http: HttpClient) { }

  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(this.apiUrl);
  }

  getInterview(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/${id}`);
  }

  getInterviewsByApplication(applicationId: number): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/application/${applicationId}`);
  }

  getInterviewsByInterviewer(interviewerId: number): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.apiUrl}/interviewer/${interviewerId}`);
  }

  createInterview(interview: CreateInterview): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl, interview);
  }

  updateInterview(id: number, interview: UpdateInterview): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, interview);
  }

  deleteInterview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
