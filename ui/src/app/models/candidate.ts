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
}

export interface CandidateCreateRequest {
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
}
