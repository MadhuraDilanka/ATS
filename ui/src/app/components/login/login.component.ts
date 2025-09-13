import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  features = [
    {
      icon: 'speed',
      title: 'Streamlined Process',
      description: 'Automate and accelerate your hiring workflow with intelligent tools'
    },
    {
      icon: 'psychology',
      title: 'Smart Matching',
      description: 'AI-powered candidate matching based on skills and experience'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Real-time insights and reports to optimize your recruitment strategy'
    },
    {
      icon: 'groups',
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools for your entire hiring team'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  fillDemoCredentials(role: string): void {
    this.errorMessage = '';
    switch (role) {
      case 'hr':
        this.loginForm.patchValue({
          email: 'hr@ats.com',
          password: 'Password123!'
        });
        break;
      case 'manager':
        this.loginForm.patchValue({
          email: 'manager@ats.com',
          password: 'Password123!'
        });
        break;
      case 'candidate':
        this.loginForm.patchValue({
          email: 'candidate@ats.com',
          password: 'Password123!'
        });
        break;
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Welcome back! Login successful', '✓', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Invalid credentials. Please check your email and password.';
          this.snackBar.open(this.errorMessage, '✗', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
