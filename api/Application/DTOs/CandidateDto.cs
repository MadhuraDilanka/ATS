namespace api.Application.DTOs;

public class CandidateDto
{
    public int Id { get; set; }
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
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int ApplicationCount { get; set; }
    public List<string> Skills { get; set; } = new List<string>();
}

public class CreateCandidateDto
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
}

public class UpdateCandidateDto
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
    public bool IsAvailable { get; set; }
}
