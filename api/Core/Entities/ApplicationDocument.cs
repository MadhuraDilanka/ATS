namespace api.Core.Entities;

public class ApplicationDocument : BaseEntity
{
    public int ApplicationId { get; set; }
    public int DocumentId { get; set; }
    
    // Navigation properties
    public virtual Application Application { get; set; } = null!;
    public virtual Document Document { get; set; } = null!;
}
