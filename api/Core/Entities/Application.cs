using api.Core.Enums;

namespace api.Core.Entities;

public class Application : BaseEntity
{
    public int JobId { get; set; }
    public int CandidateId { get; set; }
    public ApplicationStatus Status { get; set; }
    public string? CoverLetter { get; set; }
    public string? Notes { get; set; }
    public DateTime AppliedDate { get; set; }
    public int? Rating { get; set; } // 1-5 scale
    public string? ReviewerNotes { get; set; }
    
    // Navigation properties
    public virtual Job Job { get; set; } = null!;
    public virtual Candidate Candidate { get; set; } = null!;
    public virtual User? Reviewer { get; set; }
    public virtual ICollection<Interview> Interviews { get; set; } = new List<Interview>();
    public virtual ICollection<ApplicationDocument> ApplicationDocuments { get; set; } = new List<ApplicationDocument>();
}
