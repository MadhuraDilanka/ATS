namespace api.Core.Entities;

public class Candidate : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? LinkedInProfile { get; set; }
    public string? GitHubProfile { get; set; }
    public string? Portfolio { get; set; }
    public string? Summary { get; set; }
    public int? YearsOfExperience { get; set; }
    public string? CurrentJobTitle { get; set; }
    public string? CurrentCompany { get; set; }
    public decimal? ExpectedSalary { get; set; }
    public bool IsAvailable { get; set; } = true;
    
    // Navigation properties
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    public virtual ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    public virtual ICollection<Experience> Experiences { get; set; } = new List<Experience>();
    public virtual ICollection<Education> Educations { get; set; } = new List<Education>();
    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
}
