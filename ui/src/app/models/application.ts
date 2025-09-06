import { ApplicationStatus } from './enums';
import { Job } from './job';
import { Candidate } from './candidate';

export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: ApplicationStatus;
  coverLetter?: string;
  notes?: string;
  appliedDate: Date;
  rating?: number;
  reviewerNotes?: string;
  job: Job;
  candidate: Candidate;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationCreateRequest {
  jobId: number;
  candidateId: number;
  coverLetter?: string;
  notes?: string;
}
