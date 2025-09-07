using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Infrastructure.Data;
using api.Application.DTOs;
using api.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using ApplicationEntity = api.Core.Entities.Application;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly ATSDbContext _context;

    public ApplicationsController(ATSDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplications()
    {
        var applications = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .Include(a => a.Reviewer)
            .Include(a => a.Interviews)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                CandidateId = a.CandidateId,
                CandidateName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                CandidateEmail = a.Candidate.Email,
                Status = a.Status,
                CoverLetter = a.CoverLetter,
                Notes = a.Notes,
                AppliedDate = a.AppliedDate,
                Rating = a.Rating,
                ReviewerNotes = a.ReviewerNotes,
                ReviewerId = a.Reviewer != null ? a.Reviewer.Id : null,
                ReviewerName = a.Reviewer != null ? $"{a.Reviewer.FirstName} {a.Reviewer.LastName}" : null,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                InterviewCount = a.Interviews.Count
            })
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationDto>> GetApplication(int id)
    {
        var application = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .Include(a => a.Reviewer)
            .Include(a => a.Interviews)
            .Where(a => a.Id == id)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                CandidateId = a.CandidateId,
                CandidateName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                CandidateEmail = a.Candidate.Email,
                Status = a.Status,
                CoverLetter = a.CoverLetter,
                Notes = a.Notes,
                AppliedDate = a.AppliedDate,
                Rating = a.Rating,
                ReviewerNotes = a.ReviewerNotes,
                ReviewerId = a.Reviewer != null ? a.Reviewer.Id : null,
                ReviewerName = a.Reviewer != null ? $"{a.Reviewer.FirstName} {a.Reviewer.LastName}" : null,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                InterviewCount = a.Interviews.Count
            })
            .FirstOrDefaultAsync();

        if (application == null)
        {
            return NotFound();
        }

        return Ok(application);
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationDto>> CreateApplication(CreateApplicationDto createApplicationDto)
    {
        var application = new ApplicationEntity
        {
            JobId = createApplicationDto.JobId,
            CandidateId = createApplicationDto.CandidateId,
            CoverLetter = createApplicationDto.CoverLetter,
            Notes = createApplicationDto.Notes,
            AppliedDate = DateTime.UtcNow,
            Status = Core.Enums.ApplicationStatus.Applied,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, await GetApplicationDto(application.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateApplication(int id, UpdateApplicationDto updateApplicationDto)
    {
        var application = await _context.Applications.FindAsync(id);

        if (application == null)
        {
            return NotFound();
        }

        application.Status = updateApplicationDto.Status;
        application.Notes = updateApplicationDto.Notes;
        application.Rating = updateApplicationDto.Rating;
        application.ReviewerNotes = updateApplicationDto.ReviewerNotes;
        application.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ApplicationExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApplication(int id)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application == null)
        {
            return NotFound();
        }

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("job/{jobId}")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplicationsByJob(int jobId)
    {
        var applications = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .Include(a => a.Reviewer)
            .Include(a => a.Interviews)
            .Where(a => a.JobId == jobId)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                CandidateId = a.CandidateId,
                CandidateName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                CandidateEmail = a.Candidate.Email,
                Status = a.Status,
                CoverLetter = a.CoverLetter,
                Notes = a.Notes,
                AppliedDate = a.AppliedDate,
                Rating = a.Rating,
                ReviewerNotes = a.ReviewerNotes,
                ReviewerId = a.Reviewer != null ? a.Reviewer.Id : null,
                ReviewerName = a.Reviewer != null ? $"{a.Reviewer.FirstName} {a.Reviewer.LastName}" : null,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                InterviewCount = a.Interviews.Count
            })
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("candidate/{candidateId}")]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetApplicationsByCandidate(int candidateId)
    {
        var applications = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .Include(a => a.Reviewer)
            .Include(a => a.Interviews)
            .Where(a => a.CandidateId == candidateId)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                CandidateId = a.CandidateId,
                CandidateName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                CandidateEmail = a.Candidate.Email,
                Status = a.Status,
                CoverLetter = a.CoverLetter,
                Notes = a.Notes,
                AppliedDate = a.AppliedDate,
                Rating = a.Rating,
                ReviewerNotes = a.ReviewerNotes,
                ReviewerId = a.Reviewer != null ? a.Reviewer.Id : null,
                ReviewerName = a.Reviewer != null ? $"{a.Reviewer.FirstName} {a.Reviewer.LastName}" : null,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                InterviewCount = a.Interviews.Count
            })
            .ToListAsync();

        return Ok(applications);
    }

    private bool ApplicationExists(int id)
    {
        return _context.Applications.Any(e => e.Id == id);
    }

    private async Task<ApplicationDto> GetApplicationDto(int id)
    {
        return await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Candidate)
            .Include(a => a.Reviewer)
            .Include(a => a.Interviews)
            .Where(a => a.Id == id)
            .Select(a => new ApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                CandidateId = a.CandidateId,
                CandidateName = $"{a.Candidate.FirstName} {a.Candidate.LastName}",
                CandidateEmail = a.Candidate.Email,
                Status = a.Status,
                CoverLetter = a.CoverLetter,
                Notes = a.Notes,
                AppliedDate = a.AppliedDate,
                Rating = a.Rating,
                ReviewerNotes = a.ReviewerNotes,
                ReviewerId = a.Reviewer != null ? a.Reviewer.Id : null,
                ReviewerName = a.Reviewer != null ? $"{a.Reviewer.FirstName} {a.Reviewer.LastName}" : null,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                InterviewCount = a.Interviews.Count
            })
            .FirstAsync();
    }
}
