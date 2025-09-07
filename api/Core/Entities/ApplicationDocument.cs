namespace api.Core.Entities;

public class ApplicationDocument : BaseEntity
{
    public int ApplicationId { get; set; }
    public int DocumentId { get; set; }
    
    public virtual Application Application { get; set; } = null!;
    public virtual Document Document { get; set; } = null!;
}
