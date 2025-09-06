# ATS Login Credentials

## Test User Accounts

The ATS application currently uses mock authentication for testing purposes. You can login with any of the following accounts:

### 1. HR Manager Account
- **Email:** `hr@ats.com`
- **Password:** `password123`
- **Role:** HR
- **Access:** Full access to all features (jobs, candidates, applications, interviews)

### 2. Engineering Manager Account  
- **Email:** `manager@ats.com`
- **Password:** `password123`
- **Role:** Manager
- **Access:** Can view candidates, applications, and interviews. Can create/edit jobs.

### 3. Candidate Account
- **Email:** `candidate@ats.com`
- **Password:** `password123`
- **Role:** Candidate
- **Access:** Limited access - mainly for viewing own applications and profile

## Application Features by Role

### HR Manager (`hr@ats.com`)
✅ Create, edit, and delete job postings
✅ View and search all candidates
✅ Manage applications and track status
✅ Schedule and manage interviews
✅ Full dashboard with KPIs

### Manager (`manager@ats.com`) 
✅ View and create job postings
✅ View candidates for their department
✅ Review applications and update status
✅ Schedule interviews
✅ Department-specific dashboard

### Candidate (`candidate@ats.com`)
✅ View available job postings
✅ Apply for positions
✅ Track application status
✅ View interview schedules
✅ Personal dashboard

## How to Login

1. Open the application at `http://localhost:4200`
2. Use any of the email/password combinations above
3. Click "Sign In"
4. You'll be redirected to the dashboard based on your role

## Note

This is currently using **mock authentication** for testing purposes. When the backend API is fully implemented, these credentials will be replaced with real user accounts stored in the database.

## Next Steps

- Backend authentication controller implementation
- Real JWT token generation
- Database-backed user management
- Password reset functionality
- Email verification
