import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/enums';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('drawer', { static: true }) drawer!: MatSidenav;

  isHandset$: Observable<boolean>;
  currentUser$;
  UserRole = UserRole;

  menuItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      roles: [UserRole.HR, UserRole.Manager, UserRole.Candidate]
    },
    {
      icon: 'work',
      label: 'Jobs',
      route: '/jobs',
      roles: [UserRole.HR, UserRole.Manager, UserRole.Candidate]
    },
    {
      icon: 'people',
      label: 'Candidates',
      route: '/candidates',
      roles: [UserRole.HR, UserRole.Manager]
    },
    {
      icon: 'assignment',
      label: 'Applications',
      route: '/applications',
      roles: [UserRole.HR, UserRole.Manager]
    },
    {
      icon: 'event',
      label: 'Interviews',
      route: '/interviews',
      roles: [UserRole.HR, UserRole.Manager]
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  canAccess(allowedRoles: UserRole[], userRole: UserRole): boolean {
    return allowedRoles.includes(userRole);
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/jobs')) return 'Jobs';
    if (url.includes('/candidates')) return 'Candidates';
    if (url.includes('/applications')) return 'Applications';
    if (url.includes('/interviews')) return 'Interviews';
    return 'ATS Pro';
  }

  hasPermission(roles: UserRole[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    // Close drawer on mobile after navigation
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.drawer.close();
      }
    });
  }

  getUserInitials(user: any): string {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getUserRoleDisplay(role: UserRole): string {
    switch (role) {
      case UserRole.HR:
        return 'HR Manager';
      case UserRole.Manager:
        return 'Manager';
      case UserRole.Candidate:
        return 'Candidate';
      default:
        return 'User';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}