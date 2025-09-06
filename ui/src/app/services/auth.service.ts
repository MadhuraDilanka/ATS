import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user';
import { UserRole } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.checkCurrentUser();
  }

  private checkCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      // Handle mock tokens for testing
      if (token.startsWith('mock.jwt.token')) {
        // For mock tokens, we'll need to get user from localStorage or keep logged in state
        // This is just for testing until we have real JWT tokens
        return;
      }
      
      // Handle real JWT tokens
      if (!this.jwtHelper.isTokenExpired(token)) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        const user: User = {
          id: decodedToken.nameid,
          firstName: decodedToken.given_name,
          lastName: decodedToken.family_name,
          email: decodedToken.email,
          role: decodedToken.role,
          isActive: true,
          department: decodedToken.department,
          jobTitle: decodedToken.job_title,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.currentUserSubject.next(user);
      }
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Temporary mock authentication for testing
    // TODO: Replace with real API call when backend auth controller is ready
    return this.mockLogin(loginRequest);
    
    // Real API call (commented out until backend is ready):
    // return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
    //   .pipe(
    //     tap(response => {
    //       localStorage.setItem('token', response.token);
    //       this.currentUserSubject.next(response.user);
    //     })
    //   );
  }

  private mockLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Mock user credentials for testing
    const mockUsers = [
      {
        email: 'hr@ats.com',
        password: 'password123',
        user: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'hr@ats.com',
          role: UserRole.HR,
          isActive: true,
          department: 'Human Resources',
          jobTitle: 'HR Manager',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      {
        email: 'manager@ats.com',
        password: 'password123',
        user: {
          id: 2,
          firstName: 'John',
          lastName: 'Smith',
          email: 'manager@ats.com',
          role: UserRole.Manager,
          isActive: true,
          department: 'Engineering',
          jobTitle: 'Engineering Manager',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      {
        email: 'candidate@ats.com',
        password: 'password123',
        user: {
          id: 3,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'candidate@ats.com',
          role: UserRole.Candidate,
          isActive: true,
          department: '',
          jobTitle: 'Software Engineer',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ];

    const mockUser = mockUsers.find(u => 
      u.email === loginRequest.email && u.password === loginRequest.password
    );

    if (mockUser) {
      // Create a mock JWT token
      const mockToken = `mock.jwt.token.${Date.now()}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now
      
      const response: LoginResponse = {
        token: mockToken,
        user: mockUser.user,
        expiresAt: expiresAt
      };

      // Simulate API delay
      return of(response).pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  register(registerRequest: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Handle mock tokens for testing
    if (token.startsWith('mock.jwt.token')) {
      return this.currentUserSubject.value !== null;
    }
    
    // Handle real JWT tokens
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  hasRole(role: UserRole): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? roles.includes(currentUser.role) : false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isHR(): boolean {
    return this.hasRole(UserRole.HR);
  }

  isManager(): boolean {
    return this.hasRole(UserRole.Manager);
  }

  isCandidate(): boolean {
    return this.hasRole(UserRole.Candidate);
  }
}
