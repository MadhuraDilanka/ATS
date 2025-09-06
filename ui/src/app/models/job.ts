import { JobStatus, ExperienceLevel, EmploymentType } from './enums';
import { User } from './user';

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
  hiringManager: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCreateRequest {
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
