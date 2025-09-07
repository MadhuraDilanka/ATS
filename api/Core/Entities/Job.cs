using api.Core.Enums;

namespace api.Core.Entities;

public class Job : BaseEntity
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
    
    public int HiringManagerId { get; set; }
    
    public virtual User HiringManager { get; set; } = null!;
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    public virtual ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}
