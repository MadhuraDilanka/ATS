using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Infrastructure.Data;
using api.Application.DTOs;
using api.Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InterviewsController : ControllerBase
{
    private readonly ATSDbContext _context;

    public InterviewsController(ATSDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InterviewDto>>> GetInterviews()
    {
        var interviews = await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Interviewer)
            .Select(i => new InterviewDto
            {
                Id = i.Id,
                ApplicationId = i.ApplicationId,
                InterviewerId = i.InterviewerId,
                InterviewerName = $"{i.Interviewer.FirstName} {i.Interviewer.LastName}",
                CandidateId = i.Application.CandidateId,
                CandidateName = $"{i.Application.Candidate.FirstName} {i.Application.Candidate.LastName}",
                CandidateEmail = i.Application.Candidate.Email,
                JobId = i.Application.JobId,
                JobTitle = i.Application.Job.Title,
                Type = i.Type,
                Status = i.Status,
                ScheduledDateTime = i.ScheduledDateTime,
                DurationMinutes = i.DurationMinutes,
                Location = i.Location,
                MeetingLink = i.MeetingLink,
                Notes = i.Notes,
                Feedback = i.Feedback,
                Rating = i.Rating,
                Recommendation = i.Recommendation,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            })
            .ToListAsync();

        return Ok(interviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InterviewDto>> GetInterview(int id)
    {
        var interview = await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Interviewer)
            .Where(i => i.Id == id)
            .Select(i => new InterviewDto
            {
                Id = i.Id,
                ApplicationId = i.ApplicationId,
                InterviewerId = i.InterviewerId,
                InterviewerName = $"{i.Interviewer.FirstName} {i.Interviewer.LastName}",
                CandidateId = i.Application.CandidateId,
                CandidateName = $"{i.Application.Candidate.FirstName} {i.Application.Candidate.LastName}",
                CandidateEmail = i.Application.Candidate.Email,
                JobId = i.Application.JobId,
                JobTitle = i.Application.Job.Title,
                Type = i.Type,
                Status = i.Status,
                ScheduledDateTime = i.ScheduledDateTime,
                DurationMinutes = i.DurationMinutes,
                Location = i.Location,
                MeetingLink = i.MeetingLink,
                Notes = i.Notes,
                Feedback = i.Feedback,
                Rating = i.Rating,
                Recommendation = i.Recommendation,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (interview == null)
        {
            return NotFound();
        }

        return Ok(interview);
    }

    [HttpPost]
    public async Task<ActionResult<InterviewDto>> CreateInterview(CreateInterviewDto createInterviewDto)
    {
        var interview = new Interview
        {
            ApplicationId = createInterviewDto.ApplicationId,
            InterviewerId = createInterviewDto.InterviewerId,
            Type = createInterviewDto.Type,
            ScheduledDateTime = createInterviewDto.ScheduledDateTime,
            DurationMinutes = createInterviewDto.DurationMinutes,
            Location = createInterviewDto.Location,
            MeetingLink = createInterviewDto.MeetingLink,
            Notes = createInterviewDto.Notes,
            Status = Core.Enums.InterviewStatus.Scheduled,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Interviews.Add(interview);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInterview), new { id = interview.Id }, await GetInterviewDto(interview.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInterview(int id, UpdateInterviewDto updateInterviewDto)
    {
        var interview = await _context.Interviews.FindAsync(id);

        if (interview == null)
        {
            return NotFound();
        }

        interview.Status = updateInterviewDto.Status;
        interview.ScheduledDateTime = updateInterviewDto.ScheduledDateTime;
        interview.DurationMinutes = updateInterviewDto.DurationMinutes;
        interview.Location = updateInterviewDto.Location;
        interview.MeetingLink = updateInterviewDto.MeetingLink;
        interview.Notes = updateInterviewDto.Notes;
        interview.Feedback = updateInterviewDto.Feedback;
        interview.Rating = updateInterviewDto.Rating;
        interview.Recommendation = updateInterviewDto.Recommendation;
        interview.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!InterviewExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInterview(int id)
    {
        var interview = await _context.Interviews.FindAsync(id);
        if (interview == null)
        {
            return NotFound();
        }

        _context.Interviews.Remove(interview);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("application/{applicationId}")]
    public async Task<ActionResult<IEnumerable<InterviewDto>>> GetInterviewsByApplication(int applicationId)
    {
        var interviews = await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Interviewer)
            .Where(i => i.ApplicationId == applicationId)
            .Select(i => new InterviewDto
            {
                Id = i.Id,
                ApplicationId = i.ApplicationId,
                InterviewerId = i.InterviewerId,
                InterviewerName = $"{i.Interviewer.FirstName} {i.Interviewer.LastName}",
                CandidateId = i.Application.CandidateId,
                CandidateName = $"{i.Application.Candidate.FirstName} {i.Application.Candidate.LastName}",
                CandidateEmail = i.Application.Candidate.Email,
                JobId = i.Application.JobId,
                JobTitle = i.Application.Job.Title,
                Type = i.Type,
                Status = i.Status,
                ScheduledDateTime = i.ScheduledDateTime,
                DurationMinutes = i.DurationMinutes,
                Location = i.Location,
                MeetingLink = i.MeetingLink,
                Notes = i.Notes,
                Feedback = i.Feedback,
                Rating = i.Rating,
                Recommendation = i.Recommendation,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            })
            .ToListAsync();

        return Ok(interviews);
    }

    [HttpGet("interviewer/{interviewerId}")]
    public async Task<ActionResult<IEnumerable<InterviewDto>>> GetInterviewsByInterviewer(int interviewerId)
    {
        var interviews = await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Interviewer)
            .Where(i => i.InterviewerId == interviewerId)
            .Select(i => new InterviewDto
            {
                Id = i.Id,
                ApplicationId = i.ApplicationId,
                InterviewerId = i.InterviewerId,
                InterviewerName = $"{i.Interviewer.FirstName} {i.Interviewer.LastName}",
                CandidateId = i.Application.CandidateId,
                CandidateName = $"{i.Application.Candidate.FirstName} {i.Application.Candidate.LastName}",
                CandidateEmail = i.Application.Candidate.Email,
                JobId = i.Application.JobId,
                JobTitle = i.Application.Job.Title,
                Type = i.Type,
                Status = i.Status,
                ScheduledDateTime = i.ScheduledDateTime,
                DurationMinutes = i.DurationMinutes,
                Location = i.Location,
                MeetingLink = i.MeetingLink,
                Notes = i.Notes,
                Feedback = i.Feedback,
                Rating = i.Rating,
                Recommendation = i.Recommendation,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            })
            .ToListAsync();

        return Ok(interviews);
    }

    private bool InterviewExists(int id)
    {
        return _context.Interviews.Any(e => e.Id == id);
    }

    private async Task<InterviewDto> GetInterviewDto(int id)
    {
        return await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Interviewer)
            .Where(i => i.Id == id)
            .Select(i => new InterviewDto
            {
                Id = i.Id,
                ApplicationId = i.ApplicationId,
                InterviewerId = i.InterviewerId,
                InterviewerName = $"{i.Interviewer.FirstName} {i.Interviewer.LastName}",
                CandidateId = i.Application.CandidateId,
                CandidateName = $"{i.Application.Candidate.FirstName} {i.Application.Candidate.LastName}",
                CandidateEmail = i.Application.Candidate.Email,
                JobId = i.Application.JobId,
                JobTitle = i.Application.Job.Title,
                Type = i.Type,
                Status = i.Status,
                ScheduledDateTime = i.ScheduledDateTime,
                DurationMinutes = i.DurationMinutes,
                Location = i.Location,
                MeetingLink = i.MeetingLink,
                Notes = i.Notes,
                Feedback = i.Feedback,
                Rating = i.Rating,
                Recommendation = i.Recommendation,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            })
            .FirstAsync();
    }
}
