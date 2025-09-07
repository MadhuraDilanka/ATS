using api.Core.Enums;

namespace api.Application.DTOs;

public class ApplicationDto
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public int CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public string? CoverLetter { get; set; }
    public string? Notes { get; set; }
    public DateTime AppliedDate { get; set; }
    public int? Rating { get; set; }
    public string? ReviewerNotes { get; set; }
    public int? ReviewerId { get; set; }
    public string? ReviewerName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int InterviewCount { get; set; }
}

public class CreateApplicationDto
{
    public int JobId { get; set; }
    public int CandidateId { get; set; }
    public string? CoverLetter { get; set; }
    public string? Notes { get; set; }
}

public class UpdateApplicationDto
{
    public ApplicationStatus Status { get; set; }
    public string? Notes { get; set; }
    public int? Rating { get; set; }
    public string? ReviewerNotes { get; set; }
    public int? ReviewerId { get; set; }
}
