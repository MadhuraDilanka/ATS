using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Infrastructure.Data;
using api.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using api.Core.Enums;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ATSDbContext _context;

    public DashboardController(ATSDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboardData()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);
        var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(7);

        var totalJobs = await _context.Jobs.CountAsync();
        var activeJobs = await _context.Jobs.CountAsync(j => j.Status == JobStatus.Active);
        var totalApplications = await _context.Applications.CountAsync();
        var newApplicationsThisMonth = await _context.Applications
            .CountAsync(a => a.AppliedDate >= startOfMonth);

        var interviewsThisWeek = await _context.Interviews
            .CountAsync(i => i.ScheduledDateTime >= startOfWeek && i.ScheduledDateTime < endOfWeek);

        var hiredThisMonth = await _context.Applications
            .CountAsync(a => a.Status == ApplicationStatus.Hired && a.UpdatedAt >= startOfMonth);

        var conversionRate = totalApplications > 0 
            ? Math.Round((decimal)hiredThisMonth / totalApplications * 100, 2) 
            : 0;

        var jobStatusBreakdown = await _context.Jobs
            .GroupBy(j => j.Status)
            .Select(g => new JobStatusSummary
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        var applicationStatusBreakdown = await _context.Applications
            .GroupBy(a => a.Status)
            .Select(g => new ApplicationStatusSummary
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        var monthlyHiring = await GetMonthlyHiringSummary();
        var departmentBreakdown = await GetDepartmentBreakdown();

        var dashboardData = new DashboardDto
        {
            TotalJobs = totalJobs,
            ActiveJobs = activeJobs,
            TotalApplications = totalApplications,
            NewApplicationsThisMonth = newApplicationsThisMonth,
            InterviewsThisWeek = interviewsThisWeek,
            HiredThisMonth = hiredThisMonth,
            ConversionRate = conversionRate,
            JobStatusBreakdown = jobStatusBreakdown,
            ApplicationStatusBreakdown = applicationStatusBreakdown,
            MonthlyHiring = monthlyHiring,
            DepartmentBreakdown = departmentBreakdown
        };

        return Ok(dashboardData);
    }

    [HttpGet("quick-stats")]
    public async Task<ActionResult<object>> GetQuickStats()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);
        var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(7);

        var stats = new
        {
            TotalJobs = await _context.Jobs.CountAsync(),
            ActiveJobs = await _context.Jobs.CountAsync(j => j.Status == JobStatus.Active),
            TotalApplications = await _context.Applications.CountAsync(),
            NewApplicationsThisMonth = await _context.Applications
                .CountAsync(a => a.AppliedDate >= startOfMonth),
            InterviewsThisWeek = await _context.Interviews
                .CountAsync(i => i.ScheduledDateTime >= startOfWeek && i.ScheduledDateTime < endOfWeek),
            HiredThisMonth = await _context.Applications
                .CountAsync(a => a.Status == ApplicationStatus.Hired && a.UpdatedAt >= startOfMonth)
        };

        return Ok(stats);
    }

    [HttpGet("recent-activities")]
    public async Task<ActionResult<object>> GetRecentActivities()
    {
        var recentApplications = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .OrderByDescending(a => a.AppliedDate)
            .Take(5)
            .Select(a => new
            {
                Type = "Application",
                Description = $"{a.Candidate.FirstName} {a.Candidate.LastName} applied for {a.Job.Title}",
                Date = a.AppliedDate,
                Status = a.Status.ToString()
            })
            .ToListAsync();

        var recentInterviews = await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .OrderByDescending(i => i.CreatedAt)
            .Take(5)
            .Select(i => new
            {
                Type = "Interview",
                Description = $"Interview scheduled for {i.Application.Candidate.FirstName} {i.Application.Candidate.LastName} - {i.Application.Job.Title}",
                Date = i.ScheduledDateTime,
                Status = i.Status.ToString()
            })
            .ToListAsync();

        var activities = recentApplications
            .Concat(recentInterviews)
            .OrderByDescending(a => a.Date)
            .Take(10)
            .ToList();

        return Ok(activities);
    }

    private async Task<List<MonthlyHiringSummary>> GetMonthlyHiringSummary()
    {
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
        
        var monthlyData = await _context.Applications
            .Where(a => a.CreatedAt >= sixMonthsAgo)
            .GroupBy(a => new { a.CreatedAt.Year, a.CreatedAt.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                ApplicationCount = g.Count(),
                HiredCount = g.Count(a => a.Status == ApplicationStatus.Hired)
            })
            .OrderBy(g => g.Year)
            .ThenBy(g => g.Month)
            .ToListAsync();

        return monthlyData.Select(m => new MonthlyHiringSummary
        {
            Month = new DateTime(m.Year, m.Month, 1).ToString("MMM yyyy"),
            HiredCount = m.HiredCount,
            ApplicationCount = m.ApplicationCount
        }).ToList();
    }

    private async Task<List<DepartmentSummary>> GetDepartmentBreakdown()
    {
        var departmentData = await _context.Jobs
            .Include(j => j.Applications)
            .GroupBy(j => j.Department)
            .Select(g => new DepartmentSummary
            {
                Department = g.Key,
                JobCount = g.Count(),
                ApplicationCount = g.SelectMany(j => j.Applications).Count()
            })
            .OrderByDescending(d => d.JobCount)
            .ToListAsync();

        return departmentData;
    }
}
