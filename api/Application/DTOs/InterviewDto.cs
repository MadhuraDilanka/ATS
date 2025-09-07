using api.Core.Enums;

namespace api.Application.DTOs;

public class InterviewDto
{
    public int Id { get; set; }
    public int ApplicationId { get; set; }
    public int InterviewerId { get; set; }
    public string InterviewerName { get; set; } = string.Empty;
    public int CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
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
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateInterviewDto
{
    public int ApplicationId { get; set; }
    public int InterviewerId { get; set; }
    public InterviewType Type { get; set; }
    public DateTime ScheduledDateTime { get; set; }
    public int DurationMinutes { get; set; }
    public string? Location { get; set; }
    public string? MeetingLink { get; set; }
    public string? Notes { get; set; }
}

public class UpdateInterviewDto
{
    public InterviewStatus Status { get; set; }
    public DateTime ScheduledDateTime { get; set; }
    public int DurationMinutes { get; set; }
    public string? Location { get; set; }
    public string? MeetingLink { get; set; }
    public string? Notes { get; set; }
    public string? Feedback { get; set; }
    public int? Rating { get; set; }
    public string? Recommendation { get; set; }
}
