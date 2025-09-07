namespace api.Core.Entities;

public class Education : BaseEntity
{
    public int CandidateId { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string? FieldOfStudy { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Grade { get; set; }
    public string? Description { get; set; }
    
    public virtual Candidate Candidate { get; set; } = null!;
}
