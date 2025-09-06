namespace api.Core.Entities;

public class Document : BaseEntity
{
    public int CandidateId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string DocumentType { get; set; } = string.Empty; // CV, Cover Letter, Portfolio, etc.
    public string? ParsedContent { get; set; } // For search functionality
    
    // Navigation properties
    public virtual Candidate Candidate { get; set; } = null!;
    public virtual ICollection<ApplicationDocument> ApplicationDocuments { get; set; } = new List<ApplicationDocument>();
}
