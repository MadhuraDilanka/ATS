namespace api.Application.DTOs;

public class DashboardDto
{
    public int TotalJobs { get; set; }
    public int ActiveJobs { get; set; }
    public int TotalApplications { get; set; }
    public int NewApplicationsThisMonth { get; set; }
    public int InterviewsThisWeek { get; set; }
    public int HiredThisMonth { get; set; }
    public decimal ConversionRate { get; set; }
    public List<JobStatusSummary> JobStatusBreakdown { get; set; } = new List<JobStatusSummary>();
    public List<ApplicationStatusSummary> ApplicationStatusBreakdown { get; set; } = new List<ApplicationStatusSummary>();
    public List<MonthlyHiringSummary> MonthlyHiring { get; set; } = new List<MonthlyHiringSummary>();
    public List<DepartmentSummary> DepartmentBreakdown { get; set; } = new List<DepartmentSummary>();
}

public class JobStatusSummary
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class ApplicationStatusSummary
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class MonthlyHiringSummary
{
    public string Month { get; set; } = string.Empty;
    public int HiredCount { get; set; }
    public int ApplicationCount { get; set; }
}

public class DepartmentSummary
{
    public string Department { get; set; } = string.Empty;
    public int JobCount { get; set; }
    public int ApplicationCount { get; set; }
}
