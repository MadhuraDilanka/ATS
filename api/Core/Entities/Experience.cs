namespace api.Core.Entities;

public class Experience : BaseEntity
{
    public int CandidateId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
    public string? Achievements { get; set; }
    
    // Navigation properties
    public virtual Candidate Candidate { get; set; } = null!;
}
