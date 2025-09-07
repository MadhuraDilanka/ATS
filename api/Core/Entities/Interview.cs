using api.Core.Enums;

namespace api.Core.Entities;

public class Interview : BaseEntity
{
    public int ApplicationId { get; set; }
    public int InterviewerId { get; set; }
    public InterviewType Type { get; set; }
    public InterviewStatus Status { get; set; }
    public DateTime ScheduledDateTime { get; set; }
    public int DurationMinutes { get; set; }
    public string? Location { get; set; }
    public string? MeetingLink { get; set; }
    public string? Notes { get; set; }
    public string? Feedback { get; set; }
    public int? Rating { get; set; }
    public string? Recommendation { get; set; }
    
    public virtual Application Application { get; set; } = null!;
    public virtual User Interviewer { get; set; } = null!;
}
