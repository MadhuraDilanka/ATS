using api.Core.Enums;

namespace api.Application.DTOs;

public class JobDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Requirements { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public ExperienceLevel ExperienceLevel { get; set; }
    public EmploymentType EmploymentType { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobStatus Status { get; set; }
    public DateTime? ClosingDate { get; set; }
    public int MaxApplications { get; set; }
    public bool IsRemoteAllowed { get; set; }
    public int HiringManagerId { get; set; }
    public string HiringManagerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int ApplicationCount { get; set; }
}

public class CreateJobDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Requirements { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public ExperienceLevel ExperienceLevel { get; set; }
    public EmploymentType EmploymentType { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public DateTime? ClosingDate { get; set; }
    public int MaxApplications { get; set; }
    public bool IsRemoteAllowed { get; set; }
    public int HiringManagerId { get; set; }
}

public class UpdateJobDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Requirements { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public ExperienceLevel ExperienceLevel { get; set; }
    public EmploymentType EmploymentType { get; set; }
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public JobStatus Status { get; set; }
    public DateTime? ClosingDate { get; set; }
    public int MaxApplications { get; set; }
    public bool IsRemoteAllowed { get; set; }
}
