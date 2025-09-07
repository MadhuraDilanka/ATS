using Microsoft.EntityFrameworkCore;
using api.Core.Entities;
using api.Core.Enums;
using ApplicationEntity = api.Core.Entities.Application;

namespace api.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ATSDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }

        var users = new List<User>
        {
            new User
            {
                FirstName = "Sarah",
                LastName = "Wilson",
                Email = "hr@ats.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = UserRole.HR,
                IsActive = true,
                Department = "Human Resources",
                JobTitle = "HR Manager",
                PhoneNumber = "+1-555-123-4567",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FirstName = "John",
                LastName = "Smith",
                Email = "manager@ats.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = UserRole.Manager,
                IsActive = true,
                Department = "Engineering",
                JobTitle = "Engineering Manager",
                PhoneNumber = "+1-555-234-5678",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                FirstName = "Jane",
                LastName = "Doe",
                Email = "candidate@ats.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = UserRole.Candidate,
                IsActive = true,
                Department = "",
                JobTitle = "Software Engineer",
                PhoneNumber = "+1-555-345-6789",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        var skills = new List<Skill>
        {
            new Skill { Name = "C#", Category = "Programming Languages", Description = ".NET programming language", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Skill { Name = "Angular", Category = "Frontend Frameworks", Description = "TypeScript-based web framework", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Skill { Name = "SQL Server", Category = "Databases", Description = "Microsoft SQL Server", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Skill { Name = "Azure", Category = "Cloud Platforms", Description = "Microsoft Azure cloud platform", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Skill { Name = "REST APIs", Category = "Web Services", Description = "RESTful web services", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        };

        context.Skills.AddRange(skills);
        await context.SaveChangesAsync();

        var jobs = new List<Job>
        {
            new Job
            {
                Title = "Senior Software Engineer",
                Description = "We are looking for a senior software engineer to join our engineering team.",
                Requirements = "5+ years of experience in .NET, C#, Angular, SQL Server",
                Location = "New York, NY",
                Department = "Engineering",
                ExperienceLevel = ExperienceLevel.Senior,
                EmploymentType = EmploymentType.FullTime,
                SalaryMin = 90000,
                SalaryMax = 130000,
                Status = JobStatus.Active,
                ClosingDate = DateTime.UtcNow.AddMonths(2),
                MaxApplications = 50,
                IsRemoteAllowed = true,
                HiringManagerId = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Job
            {
                Title = "Frontend Developer",
                Description = "Looking for a skilled frontend developer with Angular experience.",
                Requirements = "3+ years of Angular, TypeScript, HTML, CSS experience",
                Location = "San Francisco, CA",
                Department = "Engineering",
                ExperienceLevel = ExperienceLevel.Mid,
                EmploymentType = EmploymentType.FullTime,
                SalaryMin = 70000,
                SalaryMax = 95000,
                Status = JobStatus.Active,
                ClosingDate = DateTime.UtcNow.AddMonths(1),
                MaxApplications = 30,
                IsRemoteAllowed = true,
                HiringManagerId = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Jobs.AddRange(jobs);
        await context.SaveChangesAsync();

        var candidates = new List<Candidate>
        {
            new Candidate
            {
                FirstName = "Mike",
                LastName = "Johnson",
                Email = "mike.johnson@email.com",
                PhoneNumber = "+1-555-456-7890",
                Address = "123 Main St, Boston, MA",
                LinkedInProfile = "https://linkedin.com/in/mikejohnson",
                GitHubProfile = "https://github.com/mikejohnson",
                Summary = "Experienced software developer with 6 years of experience in full-stack development.",
                YearsOfExperience = 6,
                CurrentJobTitle = "Senior Developer",
                CurrentCompany = "Tech Solutions Inc",
                ExpectedSalary = 105000,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Candidate
            {
                FirstName = "Emily",
                LastName = "Davis",
                Email = "emily.davis@email.com",
                PhoneNumber = "+1-555-567-8901",
                Address = "456 Oak Ave, Seattle, WA",
                LinkedInProfile = "https://linkedin.com/in/emilydavis",
                Summary = "Frontend specialist with expertise in modern JavaScript frameworks.",
                YearsOfExperience = 4,
                CurrentJobTitle = "Frontend Developer",
                CurrentCompany = "WebCorp",
                ExpectedSalary = 85000,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Candidates.AddRange(candidates);
        await context.SaveChangesAsync();

        var applications = new List<ApplicationEntity>
        {
            new ApplicationEntity
            {
                JobId = 1,
                CandidateId = 1,
                Status = ApplicationStatus.Applied,
                CoverLetter = "I am very interested in this senior software engineer position...",
                Notes = "Strong candidate with relevant experience",
                AppliedDate = DateTime.UtcNow.AddDays(-5),
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new ApplicationEntity
            {
                JobId = 2,
                CandidateId = 2,
                Status = ApplicationStatus.ScreeningInProgress,
                CoverLetter = "I would love to contribute to your frontend team...",
                Notes = "Good portfolio, scheduling interview",
                AppliedDate = DateTime.UtcNow.AddDays(-3),
                Rating = 4,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        context.Applications.AddRange(applications);
        await context.SaveChangesAsync();

        var interviews = new List<Interview>
        {
            new Interview
            {
                ApplicationId = 1,
                InterviewerId = 2,
                Type = InterviewType.Technical,
                Status = InterviewStatus.Scheduled,
                ScheduledDateTime = DateTime.UtcNow.AddDays(2),
                DurationMinutes = 60,
                Location = "Conference Room A",
                MeetingLink = "https://meet.google.com/abc-defg-hij",
                Notes = "Technical interview focusing on .NET and system design",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Interview
            {
                ApplicationId = 2,
                InterviewerId = 2,
                Type = InterviewType.HR,
                Status = InterviewStatus.Completed,
                ScheduledDateTime = DateTime.UtcNow.AddDays(-1),
                DurationMinutes = 45,
                Location = "Conference Room B",
                Notes = "Initial screening interview",
                Feedback = "Candidate shows good communication skills and cultural fit",
                Rating = 4,
                Recommendation = "Proceed to technical round",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Interviews.AddRange(interviews);
        await context.SaveChangesAsync();
    }
}
