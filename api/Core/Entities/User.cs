using api.Core.Enums;

namespace api.Core.Entities;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public string? PhoneNumber { get; set; }
    public string? Department { get; set; }
    public string? JobTitle { get; set; }
    
    public virtual ICollection<Job> JobsCreated { get; set; } = new List<Job>();
    public virtual ICollection<Interview> InterviewsAsInterviewer { get; set; } = new List<Interview>();
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
}
